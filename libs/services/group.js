const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { models, services } = fastify.cms;

  const getList = async ({ filter, status, perPage = 20, currentPage = 1 }) => {
    const queryFilter = {};

    if (Number.isInteger(status)) {
      queryFilter['status'] = status;
    }

    const { count, rows } = await models.group.findAndCountAll({
      where: queryFilter,
      offset: perPage * (currentPage - 1),
      limit: perPage
    });

    return {
      pageData: rows,
      totalCount: count
    };
  };

  const getDetailByCode = async ({ code }) => {
    return await models.group.findOne({
      where: { code }
    });
  };

  const add = async (info, other) => {
    const target = {};
    const groupModel = await models.group.findOne({
      where: { code: info.code }
    });
    if (groupModel) {
      throw new Error(`该对象集合已存在`);
    }
    ['code', 'name', 'description'].forEach(name => {
      if (info[name]) {
        target[name] = info[name];
      }
    });
    await models.group.create(target, other);
  };

  const copy = async ({copyGroupCode, withContent, ...info}) => {
    const t = await fastify.sequelize.instance.transaction();

    try {
      await add(info, { transaction: t });
      const objects = await models.object.findAll({
        where: {groupCode: copyGroupCode}
      });
      const fields = await models.field.findAll({
        where: {groupCode: copyGroupCode}
      });
      const references = await models.reference.findAll({
        where: {groupCode: copyGroupCode}
      });
      /*const indexes = await models.indexed.findAll({
        where: {groupCode: copyGroupCode}
      });*/

      await Promise.all(
        [
          await models.object.bulkCreate(objects.map((item) => {
            const object = {groupCode: info.code};
            ['name', 'code', 'description', 'tag', 'type'].forEach(name => {
              if (item[name]) {
                object[name] = item[name];
              }
            });
            return object;
          }), {transaction: t}),
          await models.field.bulkCreate(fields.map((item) => {
            const field = {groupCode: info.code};
            ['name', 'code', 'description', 'isList', 'isBlock', 'objectCode', 'fieldName', 'rule', 'index', 'type', 'maxLength', 'minLength', 'formInputType', 'formInputProps', 'isIndexed'].forEach(name => {
              if (item[name]) {
                field[name] = item[name];
              }
            });
            return field;
          }), {transaction: t}),
          await models.reference.bulkCreate(references.map((item) => {
            const reference = {groupCode: info.code};
            ['fieldCode', 'originObjectCode', 'targetObjectCode', 'targetObjectFieldLabelCode', 'type'].forEach(name => {
              if (item[name]) {
                reference[name] = item[name];
              }
            });
            return reference;
          }), {transaction: t}),
        ]
      );
      /*indexes.map(async (item) => {
        const indexed = {groupCode: info.code};
        ['objectCode', 'fieldName', 'value', 'contentId'].forEach(name => {
          if (item[name]) {
            indexed[name] = item[name];
          }
        });
        await models.indexed.create(indexed, {transaction: t});
      })*/
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  const save = async info => {
    if (!info.id) {
      throw new Error('id不能为空');
    }
    const group = await models.group.findByPk(info.id);
    if (!group) {
      throw new Error(`对象不存在，请刷新页面后重试`);
    }

    ['name', 'description'].forEach(name => {
      if (info[name]) {
        group[name] = info[name];
      }
    });
    await group.save();
  };

  const close = async ({ id }) => {
    const group = await models.group.findByPk(id);
    if (!group) {
      throw new Error(`对象集合不存在，请刷新页面后重试`);
    }
    group.status = 10;
    await group.save();
  };

  const open = async ({ id }) => {
    const group = await models.group.findByPk(id);
    if (!group) {
      throw new Error(`对象集合不存在，请刷新页面后重试`);
    }
    group.status = 0;
    await group.save();
  };

  const remove = async ({ id }) => {
    const group = await models.group.findByPk(id);
    if (!group) {
      throw new Error(`对象集合不存在，请刷新页面后重试`);
    }

    if (!(await services.content.contentIsEmpty({ groupCode: group.code }))) {
      throw new Error(`对象集合中已存在数据不允许删除，请处理好数据后重试`);
    }

    const t = await fastify.sequelize.instance.transaction();
    try {
      await models.reference.destroy({
        where: {
          groupCode: group.code
        },
        transaction: t
      });
      await models.field.destroy({
        where: {
          groupCode: group.code
        },
        transaction: t
      });
      await models.object.destroy({
        where: {
          groupCode: group.code
        },
        transaction: t
      });
      await group.destroy({ transaction: t });
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  fastify.cms.services.group = { getList, getDetailByCode, add, copy, save, close, open, remove };
});
