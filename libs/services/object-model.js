const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { models, services } = fastify.cms;

  const getList = async () => {};

  const getDetail = async () => {};

  const add = async () => {};

  const save = async () => {};

  const close = async () => {};

  const open = async () => {};

  fastify.cms.services.objectModel = { getList, getDetail, add, save, close, open };
});
