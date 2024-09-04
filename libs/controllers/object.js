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

  fastify.get(
    `${options.prefix}/object/getMetaInfo`,
    {
      onRequest: options.createAuthenticate('object:read'),
      schema: {
        tags: ['对象模型'],
        summary: '获取对象meta信息',
        query: {
          type: 'object',
          required: ['objectCode', 'groupCode'],
          properties: {
            objectCode: { type: 'string' },
            groupCode: { type: 'string' }
          }
        }
      }
    },
    async request => {
      return await services.object.getMetaInfo(request.query);
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
            type: { type: 'string' },
            tag: { type: 'string' },
            description: { type: 'string' },
            isSingle: { type: 'boolean' },
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
    `${options.prefix}/object/copy`,
    {
      onRequest: options.createAuthenticate('object:write'),
      schema: {
        tags: ['对象模型'],
        summary: '添加对象',
        body: {
          type: 'object',
          required: ['name', 'copyId'],
          properties: {
            copyId: { type: 'number' },
            withContent: { type: 'boolean' },
            name: { type: 'string' },
            code: { type: 'string' },
            type: { type: 'string' },
            tag: { type: 'string' },
            isSingle: { type: 'boolean' },
            description: { type: 'string' }
          }
        }
      }
    },
    async request => {
      await services.object.copy(request.body);
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
            type: { type: 'string' },
            tag: { type: 'string' },
            name: { type: 'string' },
            isSingle: { type: 'boolean' },
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

  fastify.post(
    `${options.prefix}/object/moveUp`,
    {
      onRequest: options.createAuthenticate('object:write'),
      schema: {
        tags: ['对象模型'],
        summary: '对象上移',
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
      await services.object.moveUp(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/object/moveDown`,
    {
      onRequest: options.createAuthenticate('object:write'),
      schema: {
        tags: ['对象模型'],
        summary: '对象下移',
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
      await services.object.moveDown(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/object/export`,
    {
      onRequest: options.createAuthenticate('object:write'),
      schema: {
        tags: ['对象导出'],
        summary: '对象导出',
        body: {
          type: 'object',
          required: ['objectIds', 'groupCode'],
          properties: {
            objectIds: { type: 'array', items: { type: 'string' } },
            groupCode: { type: 'string' },
            withContent: { type: 'boolean' },
          }
        },
        /*response: {
          200: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  items: {
                    type: 'object',
                    properties: {
                      objects: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            code: { type: 'string' },
                            name: { type: 'string' },
                            type: { type: 'string' },
                            isSingle: { type: 'boolean' },
                            index: { type: 'number' },
                            tag: { type: 'string' },
                            groupCode: { type: 'string' },
                            description: { type: 'string' },
                            status: { type: 'number' },
                            createdAt: { type: 'string' },
                            updatedAt: { type: 'string' },
                            deletedAt: { type: 'string' }
                          },
                        }
                      },
                      fields: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            code: { type: 'string' },
                            objectCode: { type: 'string' },
                            groupCode: { type: 'string' },
                            fieldName: { type: 'string' },
                            name: { type: 'string' },
                            rule: { type: 'string' },
                            index: { type: 'number' },
                            description: { type: 'string' },
                            type: { type: 'string' },
                            isList: { type: 'boolean' },
                            maxLength: { type: 'number' },
                            minLength: { type: 'number' },
                            formInputType: { type: 'string' },
                            formInputProps: { type: 'string' },
                            isBlock: { type: 'boolean' },
                            isHidden: { type: 'boolean' },
                            isIndexed: { type: 'boolean' },
                            status: { type: 'number' },
                            createdAt: { type: 'string' },
                            updatedAt: { type: 'string' },
                            deletedAt: { type: 'string' }
                          },
                          /!*not: {
                            anyOf: [
                              { required: ['createdAt'] },
                              { required: ['updatedAt'] },
                              { required: ['deletedAt'] },
                            ]
                          }*!/
                        }
                      },
                      references: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            groupCode: { type: 'string' },
                            fieldCode: { type: 'string' },
                            originObjectCode: { type: 'string' },
                            targetObjectCode: { type: 'string' },
                            targetObjectFieldLabelCode: { type: 'string' },
                            type: { type: 'string' },
                          }
                        }
                      },
                    }
                  }
                }
              }
            }
          }
        }*/
      }
    },
    async (request, reply) => {
      const data = await services.object.exportObject(request.body);
      return reply.send(data);
    }
  );
});
