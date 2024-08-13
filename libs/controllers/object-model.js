const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { services } = fastify.cms;
  fastify.get(
    `${options.prefix}/getObjectModelList`,
    {
      onRequest: options.createAuthenticate('object-model:read'),
      schema: {
        tags: ['对象模型'],
        summary: '获取列表',
        query: {},
        response: {
          200: {
            description: '返回值说明',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', description: '信息' }
                  }
                }
              }
            }
          }
        }
      }
    },
    async request => {
      return { message: 'welcome' };
    }
  );
});
