const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { services } = fastify.cms;
  fastify.get(
    `${options.prefix}/object/getList`,
    {
      onRequest: options.createAuthenticate('object:read'),
      schema: {
        tags: ['对象模型'],
        summary: '获取对象列表',
        query: {
          type: 'object',
          required: ['groupCode'],
          properties: {
            status: { type: 'number' },
            groupCode: { type: 'string' }
          }
        }
      }
    },
    async request => {
      return await services.object.getList(request.query);
    }
  );

  fastify.get(
    `${options.prefix}/object/getDetailByCode`,
    {
      onRequest: options.createAuthenticate('object:read'),
      schema: {
        tags: ['对象模型'],
        summary: '以code获取对象信息',
        query: {
          type: 'object',
          required: ['code', 'groupCode'],
          properties: {
            code: { type: 'string' },
            groupCode: { type: 'string' }
          }
        }
      }
    },
    async request => {
      return await services.object.getDetailByCode(request.query);
    }
  );

  fastify.post(
    `${options.prefix}/object/add`,
    {
      onRequest: options.createAuthenticate('object:write'),
      schema: {
        tags: ['对象模型'],
        summary: '添加对象',
        body: {
          type: 'object',
          required: ['name', 'groupCode'],
          properties: {
            name: { type: 'string' },
            code: { type: 'string' },
            description: { type: 'string' },
            groupCode: { type: 'string' }
          }
        }
      }
    },
    async request => {
      await services.object.add(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/object/save`,
    {
      onRequest: options.createAuthenticate('object:write'),
      schema: {
        tags: ['对象模型'],
        summary: '添加对象',
        body: {
          type: 'object',
          required: ['id', 'name'],
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            description: { type: 'string' }
          }
        }
      }
    },
    async request => {
      await services.object.save(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/object/remove`,
    {
      onRequest: options.createAuthenticate('object:write'),
      schema: {
        tags: ['对象模型'],
        summary: '删除对象',
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
      await services.object.remove(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/object/close`,
    {
      onRequest: options.createAuthenticate('object:write'),
      schema: {
        tags: ['对象模型'],
        summary: '关闭对象',
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
      await services.object.close(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/object/open`,
    {
      onRequest: options.createAuthenticate('object:write'),
      schema: {
        tags: ['对象模型'],
        summary: '开启对象',
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
      await services.object.open(request.body);
      return {};
    }
  );
});
