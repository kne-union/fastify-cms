const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { services } = fastify.cms;
  fastify.get(
    `${options.prefix}/field/getList`,
    {
      onRequest: options.createAuthenticate('field:read'),
      schema: {
        tags: ['对象模型'],
        summary: '获取对象字段列表',
        query: {
          type: 'object',
          required: ['objectCode', 'groupCode'],
          properties: {
            groupCode: { type: 'number' },
            objectCode: { type: 'number' },
            status: { type: 'number' }
          }
        }
      }
    },
    async request => {
      return await services.field.getList(request.query);
    }
  );

  fastify.post(
    `${options.prefix}/field/add`,
    {
      onRequest: options.createAuthenticate('field:write'),
      schema: {
        tags: ['对象模型'],
        summary: '添加字段',
        body: {
          type: 'object',
          required: ['name', 'groupCode', 'objectCode', 'fieldName'],
          properties: {
            groupCode: { type: 'string' },
            objectCode: { type: 'string' },
            code: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            fieldName: { type: 'string' },
            rule: { type: 'string' },
            formInputType: { type: 'string' },
            formInputProps: { type: 'object' },
            isIndexed: { type: 'boolean' },
            isList: { type: 'boolean' },
            type: { type: 'string' },
            referenceObjectCode: { type: 'string' },
            referenceType: { type: 'string' }
          }
        }
      }
    },
    async request => {
      await services.field.add(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/field/save`,
    {
      onRequest: options.createAuthenticate('field:write'),
      schema: {
        tags: ['对象模型'],
        summary: '保存字段',
        body: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            description: { type: 'string' },
            rule: { type: 'string' },
            formInputType: { type: 'string' },
            formInputProps: { type: 'object' }
          }
        }
      }
    },
    async request => {
      await services.field.save(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/field/close`,
    {
      onRequest: options.createAuthenticate('field:write'),
      schema: {
        tags: ['对象模型'],
        summary: '关闭字段',
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
      await services.field.close(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/field/open`,
    {
      onRequest: options.createAuthenticate('field:write'),
      schema: {
        tags: ['对象模型'],
        summary: '开启字段',
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
      await services.field.open(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/field/moveUp`,
    {
      onRequest: options.createAuthenticate('field:write'),
      schema: {
        tags: ['对象模型'],
        summary: '字段上移',
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
      await services.field.moveUp(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/field/moveDown`,
    {
      onRequest: options.createAuthenticate('field:write'),
      schema: {
        tags: ['对象模型'],
        summary: '字段下移',
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
      await services.field.moveDown(request.body);
      return {};
    }
  );
});
