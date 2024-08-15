const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { models, services } = fastify.cms;

  const getList = async ({ objectGroupCode }) => {
    return await models.objectModel.findAll({
      include: {
        model: models.objectGroup,
        where: {
          code: objectGroupCode
        }
      }
    });
  };

  const getDetailByCode = async ({ code }) => {
    return await models.objectModel.findOne({
      include: models.objectGroup,
      where: { code }
    });
  };

  const add = async ({ objectGroupCode, ...info }) => {
    const objectGroup = await models.objectGroup.findOne({
      where: {
        code: objectGroupCode
      }
    });
    if (!objectGroup) {
      throw new Error('对象集合不存在');
    }
    const target = { objectGroupCode };
    ['name', 'code', 'description'].forEach(name => {
      if (info[name]) {
        target[name] = info[name];
      }
    });

    await models.objectModel.create(target);
  };

  const save = async ({ id, ...info }) => {
    const objectModel = await models.objectModel.findByPk(id);

    if (!objectModel) {
      throw new Error('对象不存在');
    }

    ['name', 'description'].forEach(name => {
      if (info[name]) {
        objectModel[name] = info[name];
      }
    });

    await objectModel.save();
  };

  const remove = async ({ id }) => {
    const objectModel = await models.objectModel.findByPk(id);

    if (!objectModel) {
      throw new Error('对象不存在');
    }

    // 对象下已经有数据，不允许删除，必须清除所有数据后再执行删除

    //删除所有字段

    await objectModel.destroy();
  };
  fastify.cms.services.objectModel = { getList, getDetailByCode, add, save, remove };
});
