const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { models, services } = fastify.cms;

  const getList = async () => {};

  const add = async () => {};

  fastify.cms.services.objectField = {};
});
