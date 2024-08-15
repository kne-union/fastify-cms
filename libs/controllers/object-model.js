const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { services } = fastify.cms;
  fastify.get(
    `${options.prefix}/model/getList`,
    {
      onRequest: options.createAuthenticate('object-model:read'),
      schema: {
        tags: ['对象模型'],
        summary: '获取对象列表',
        query: {
          type: 'object',
          required: ['objectGroupCode'],
          properties: {
            objectGroupCode: { type: 'string' }
          }
        },
        response: {
          200: {
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'number' },
                      code: { type: 'string' },
                      name: { type: 'string' },
                      description: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    async request => {
      return await services.objectModel.getList({ objectGroupCode: request.query.objectGroupCode });
    }
  );

  fastify.get(
    `${options.prefix}/model/getDetailByCode`,
    {
      onRequest: options.createAuthenticate('object-model:read'),
      schema: {
        tags: ['对象模型'],
        summary: '以code获取对象信息',
        query: {
          type: 'object',
          required: ['code'],
          properties: {
            code: { type: 'string' }
          }
        },
        response: {
          200: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'number' },
                    code: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: 'string' },
                    objectGroup: {
                      type: 'object',
                      properties: {
                        id: { type: 'number' },
                        code: { type: 'string' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        status: { type: 'number' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    async request => {
      return await services.objectModel.getDetailByCode({ code: request.query.code });
    }
  );

  fastify.post(
    `${options.prefix}/model/add`,
    {
      onRequest: options.createAuthenticate('object-model:write'),
      schema: {
        tags: ['对象模型'],
        summary: '添加对象',
        body: {
          type: 'object',
          required: ['name', 'objectGroupCode'],
          properties: {
            name: { type: 'string' },
            code: { type: 'string' },
            description: { type: 'string' },
            objectGroupCode: { type: 'string' }
          }
        },
        response: {
          200: {
            content: {
              'application/json': {}
            }
          }
        }
      }
    },
    async request => {
      await services.objectModel.add(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/model/save`,
    {
      onRequest: options.createAuthenticate('object-model:write'),
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
        },
        response: {
          200: {
            content: {
              'application/json': {}
            }
          }
        }
      }
    },
    async request => {
      await services.objectModel.save(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/model/remove`,
    {
      onRequest: options.createAuthenticate('object-model:write'),
      schema: {
        tags: ['对象模型'],
        summary: '添加对象',
        body: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'number' }
          }
        },
        response: {
          200: {
            content: {
              'application/json': {}
            }
          }
        }
      }
    },
    async request => {
      await services.objectModel.remove(request.body);
      return {};
    }
  );
});
