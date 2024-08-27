const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { models, services } = fastify.cms;

  const getList = async ({ groupCode, status }) => {
    const queryFilter = {};

    if (Number.isInteger(status)) {
      queryFilter['status'] = status;
    }
    return await models.object.findAll({
      where: Object.assign({}, queryFilter, {
        groupCode
      })
    });
  };

  const getDetailByCode = async ({ code, groupCode }) => {
    const group = await models.group.findOne({
      where: { code: groupCode }
    });

    if (!group) {
      throw new Error('对象集合不存在');
    }

    const object = await models.object.findOne({
      where: { code, groupCode }
    });

    if (!object) {
      throw new Error('对象不存在');
    }
    return Object.assign({}, object.get({ plain: true }), {
      group: group.get({ plain: true })
    });
  };

  const add = async ({ groupCode, ...info }, other) => {
    const objectGroup = await models.group.findOne({
      where: {
        code: groupCode
      },
      ...other
    });
    if (!objectGroup) {
      throw new Error('对象集合不存在');
    }
    const target = { groupCode };
    ['name', 'code', 'description'].forEach(name => {
      if (info[name]) {
        target[name] = info[name];
      }
    });

    await models.object.create(target, other);
  };

  const save = async ({ id, ...info }) => {
    const object = await models.object.findByPk(id);

    if (!object) {
      throw new Error('对象不存在');
    }

    ['name', 'description'].forEach(name => {
      if (info[name]) {
        object[name] = info[name];
      }
    });

    await object.save();
  };

  const close = async ({ id }) => {
    const object = await models.object.findByPk(id);
    if (!object) {
      throw new Error(`对象不存在，请刷新页面后重试`);
    }
    object.status = 10;
    await object.save();
  };

  const open = async ({ id }) => {
    const object = await models.object.findByPk(id);
    if (!object) {
      throw new Error(`对象不存在，请刷新页面后重试`);
    }
    object.status = 0;
    await object.save();
  };

  const getMetaInfo = async ({ groupCode, objectCode }) => {
    const object = await getDetailByCode({ groupCode, code: objectCode });
    const fields = await services.field.getList({
      objectCode,
      groupCode,
      status: 0
    });
    const references = await models.reference.findAll({
      where: {
        groupCode,
        originObjectCode: objectCode
      }
    });

    return {
      object,
      fields,
      references
    };
  };

  const remove = async ({ id }) => {
    const object = await models.object.findByPk(id);

    if (!object) {
      throw new Error('对象不存在');
    }

    if (!(await services.content.contentIsEmpty({ groupCode: object.groupCode, objectCode: object.code }))) {
      throw new Error(`对象中已存在数据不允许删除，请处理好数据后重试`);
    }

    if (
      (await models.reference.count({
        where: {
          groupCode: object.groupCode,
          targetObjectCode: object.code
        }
      })) > 0
    ) {
      throw new Error('该对象已经被其他对象字段引用，不允许删除');
    }

    const t = await fastify.sequelize.instance.transaction();
    try {
      await models.reference.destroy({
        where: {
          groupCode: object.groupCode,
          originObjectCode: object.code
        },
        transaction: t
      });
      await models.field.destroy({
        where: {
          groupCode: object.groupCode,
          objectCode: object.code
        },
        transaction: t
      });
      await object.destroy({ transaction: t });
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  const copy = async ({copyId, withContent, ...info }) => {
    /**
     * 1. 新建object
     * 2. 复制所有field
     * 3. 复制field所有相关reference
     * */
    const t = await fastify.sequelize.instance.transaction();
    const object = await models.object.findOne({
      where: {
        id: copyId
      },
      transaction: t
    });
    if (!object) {
      throw new Error('复制对象不存在');
    }
    const target = { groupCode: object.groupCode };
    ['name', 'code', 'description'].forEach(name => {
      if (info[name]) {
        target[name] = info[name];
      }
    });
    const {groupCode, code} = object;
    const fields = await models.field.findAll({
      where: {groupCode, objectCode: code}
    });

    const references = await models.reference.findAll({
      where: {groupCode, originObjectCode: code}
    });

    try {
      await Promise.all(
        [
          await models.object.create(target, { transaction: t }),
          await models.field.bulkCreate(fields.map((item) => {
            const field = {groupCode, objectCode: info.code};
            ['name', 'code', 'description', 'isList', 'isBlock', 'fieldName', 'rule', 'index', 'type', 'maxLength', 'minLength', 'formInputType', 'formInputProps', 'isIndexed'].forEach(name => {
              if (item[name]) {
                field[name] = item[name];
              }
            });
            return field;
          }), {transaction: t}),
          await models.reference.bulkCreate(references.map((item) => {
            const reference = {groupCode, originObjectCode: info.code};
            ['fieldCode', 'targetObjectCode', 'targetObjectFieldLabelCode', 'type'].forEach(name => {
              if (item[name]) {
                reference[name] = item[name];
              }
            });
            return reference;
          }), {transaction: t}),
        ]
      );
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  fastify.cms.services.object = { getList, getDetailByCode, add, copy, save, close, open, remove, getMetaInfo };
});
