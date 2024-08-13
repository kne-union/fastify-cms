const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { models, services } = fastify.cms;

  const getList = async ({ filter, perPage = 20, currentPage = 1 }) => {
    const queryFilter = {};

    const { count, rows } = await models.objectGroup.findAndCountAll({
      where: queryFilter,
      offset: perPage * (currentPage - 1),
      limit: perPage
    });

    return {
      pageData: rows,
      totalCount: count
    };
  };

  const add = async info => {
    const target = {};
    ['code', 'name', 'description'].forEach(name => {
      if (info[name]) {
        target[name] = info[name];
      }
    });
    await models.objectGroup.create(target);
  };

  const save = async info => {
    if (!info.id) {
      throw new Error('id不能为空');
    }
    const objectGroup = await models.objectGroup.findByPk(info.id);
    if (!objectGroup) {
      throw new Error(`对象不存在，请刷新页面后重试`);
    }

    ['name', 'description'].forEach(name => {
      if (info[name]) {
        objectGroup[name] = info[name];
      }
    });
    await objectGroup.save();
  };

  const close = async ({ id }) => {
    const objectGroup = await models.objectGroup.findByPk(id);
    if (!objectGroup) {
      throw new Error(`对象不存在，请刷新页面后重试`);
    }
    objectGroup.status = 10;
    await objectGroup.save();
  };

  const open = async ({ id }) => {
    const objectGroup = await models.objectGroup.findByPk(id);
    if (!objectGroup) {
      throw new Error(`对象不存在，请刷新页面后重试`);
    }
    objectGroup.status = 0;
    await objectGroup.save();
  };

  const remove = async ({ id }) => {
    const objectGroup = await models.objectGroup.findByPk(id);
    if (!objectGroup) {
      throw new Error(`对象不存在，请刷新页面后重试`);
    }

    if (
      (await models.objectModel.count({
        where: {
          objectGroupCode: objectGroup.code
        }
      })) > 0
    ) {
      throw new Error(`对象集合不为空，不能执行删除，请使用关闭操作代替`);
    }

    await objectGroup.destroy();
  };

  fastify.cms.services.objectGroup = { getList, add, save, close, open, remove };
});
