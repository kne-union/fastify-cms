const fp = require('fastify-plugin');
const merge = require('lodash/merge');

module.exports = fp(async (fastify, options) => {
  const { services } = fastify.cms;
  fastify.get(
    `${options.prefix}/content/getList`,
    {
      onRequest: options.createAuthenticate('content:read'),
      schema: {
        tags: ['对象内容'],
        summary: '获取对象内容列表',
        query: {
          type: 'object',
          required: ['objectCode', 'groupCode'],
          properties: {
            groupCode: { type: 'string' },
            objectCode: { type: 'string' },
            perPage: { type: 'number' },
            currentPage: { type: 'number' }
          }
        }
      }
    },
    async request => {
      return await services.content.getList(merge({ perPage: 20, currentPage: 1 }, request.query));
    }
  );

  fastify.get(
    `${options.prefix}/content/getDetail`,
    {
      onRequest: options.createAuthenticate('content:read'),
      schema: {
        tags: ['对象内容'],
        summary: '获取对象内容详情',
        query: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'number' }
          }
        }
      }
    },
    async request => {
      return await services.content.getDetail(request.query);
    }
  );

  fastify.post(
    `${options.prefix}/content/add`,
    {
      onRequest: options.createAuthenticate('content:write'),
      schema: {
        tags: ['对象内容'],
        summary: '添加对象内容',
        body: {
          type: 'object',
          required: ['data', 'objectCode', 'groupCode'],
          properties: {
            data: { type: 'object' },
            groupCode: { type: 'string' },
            objectCode: { type: 'string' }
          }
        }
      }
    },
    async request => {
      await services.content.add(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/content/save`,
    {
      onRequest: options.createAuthenticate('content:write'),
      schema: {
        tags: ['对象内容'],
        summary: '添加对象内容',
        body: {
          type: 'object',
          required: ['data'],
          properties: {
            data: { type: 'object' }
          }
        }
      }
    },
    async request => {
      await services.content.save(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/content/remove`,
    {
      onRequest: options.createAuthenticate('content:write'),
      schema: {
        tags: ['对象内容'],
        summary: '删除对象内容',
        body: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'number' }
          }
        }
      }
    },
    async request => {
      await services.content.remove(request.body);
      return {};
    }
  );
});
