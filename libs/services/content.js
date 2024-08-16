const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { models, services } = fastify.cms;

  //当对象没有数据时才允许修改
  const contentIsEmpty = async ({ groupCode, objectCode }) => {
    const queryFilter = {};
    if (groupCode) {
      queryFilter['groupCode'] = groupCode;
    }
    if (objectCode) {
      queryFilter['objectCode'] = objectCode;
    }
    return (
      (await models.content.count({
        where: Object.assign({}, queryFilter)
      })) === 0
    );
  };

  fastify.cms.services.content = { contentIsEmpty };
});
