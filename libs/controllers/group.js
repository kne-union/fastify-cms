const fp = require('fastify-plugin');
const merge = require('lodash/merge');
module.exports = fp(async (fastify, options) => {
  const { services } = fastify.cms;
  fastify.get(
    `${options.prefix}/group/getList`,
    {
      onRequest: options.createAuthenticate('group:read'),
      schema: {
        tags: ['对象模型'],
        summary: '获取对象集合列表',
        query: {
          type: 'object',
          properties: {
            status: { type: 'number' },
            perPage: { type: 'number' },
            currentPage: { type: 'number' }
          }
        },
        response: {
          200: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    pageData: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'number' },
                          code: { type: 'string' },
                          name: { type: 'string' },
                          status: { type: 'number' },
                          description: { type: 'string' }
                        }
                      }
                    },
                    totalCount: { type: 'number' }
                  }
                }
              }
            }
          }
        }
      }
    },
    async request => {
      return await services.group.getList(merge({ perPage: 20, currentPage: 1 }, request.query));
    }
  );

  fastify.get(
    `${options.prefix}/group/getDetailByCode`,
    {
      onRequest: options.createAuthenticate('group:read'),
      schema: {
        tags: ['对象模型'],
        summary: '以code获取对象集合',
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
                    status: { type: 'number' },
                    description: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    async request => {
      return await services.group.getDetailByCode({ code: request.query.code });
    }
  );

  fastify.post(
    `${options.prefix}/group/add`,
    {
      onRequest: options.createAuthenticate('group:write'),
      schema: {
        tags: ['对象模型'],
        summary: '添加对象集合',
        body: {
          type: 'object',
          required: ['name'],
          properties: {
            code: { type: 'string' },
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
      await services.group.add(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/group/copy`,
    {
      onRequest: options.createAuthenticate('group:write'),
      schema: {
        tags: ['对象模型'],
        summary: '添加对象集合',
        body: {
          type: 'object',
          required: ['name'],
          properties: {
            copyGroupCode: { type: 'string' },
            withContent: { type: 'boolean' },
            code: { type: 'string' },
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
      await services.group.copy(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/group/save`,
    {
      onRequest: options.createAuthenticate('group:write'),
      schema: {
        tags: ['对象模型'],
        summary: '修改对象集合',
        body: {
          type: 'object',
          required: ['id'],
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
      await services.group.save(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/group/close`,
    {
      onRequest: options.createAuthenticate('group:write'),
      schema: {
        tags: ['对象模型'],
        summary: '关闭对象集合',
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
      await services.group.close(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/group/open`,
    {
      onRequest: options.createAuthenticate('group:write'),
      schema: {
        tags: ['对象模型'],
        summary: '开启对象集合',
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
      await services.group.open(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/group/remove`,
    {
      onRequest: options.createAuthenticate('group:write'),
      schema: {
        tags: ['对象模型'],
        summary: '删除对象集合',
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
      await services.group.remove(request.body);
      return {};
    }
  );
});
