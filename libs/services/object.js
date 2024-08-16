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
    const object = await models.object.findOne({
      where: { code, groupCode }
    });
    const group = await models.group.findOne({
      where: { groupCode }
    });
    return Object.assign({}, object.get({ plain: true }), {
      group: group.get({ plain: true })
    });
  };

  const add = async ({ groupCode, ...info }) => {
    const objectGroup = await models.objectGroup.findOne({
      where: {
        code: groupCode
      }
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

    await models.object.create(target);
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

  const remove = async ({ id }) => {
    const object = await models.object.findByPk(id);

    if (!object) {
      throw new Error('对象不存在');
    }

    if (!(await services.content.contentIsEmpty({ groupCode: object.groupCode, objectCode: object.code }))) {
      throw new Error(`象对中已存在数据不允许删除，请处理好数据后重试`);
    }

    const t = await fastify.sequelize.instance.transaction();
    try {
      await models.reference.destroy({
        where: {
          groupCode: object.groupCode,
          objectCode: object.code
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
      await object.destroy();
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
    await object.destroy();
  };
  fastify.cms.services.object = { getList, getDetailByCode, add, save, close, open, remove };
});
