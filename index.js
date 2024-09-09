const fp = require('fastify-plugin');
const merge = require('lodash/merge');
const packageJson = require('./package.json');
const path = require('path');

const version = `v${packageJson.version.split('.')[0]}`;

module.exports = fp(
  async (fastify, options) => {
    options = merge(
      {},
      {
        prefix: `/api/${version}/cms`,
        dbTableNamePrefix: 't_cms_',
        createAuthenticate: () => {
          return [];
        }
      },
      options
    );

    fastify.register(require('@fastify/multipart'), options.multipart);
    fastify.register(require('@kne/fastify-namespace'), {
      options,
      name: 'cms',
      modules: [
        [
          'models',
          await fastify.sequelize.addModels(path.resolve(__dirname, './libs/models'), {
            prefix: options.dbTableNamePrefix
          })
        ],
        ['services', path.resolve(__dirname, './libs/services')],
        ['controllers', path.resolve(__dirname, './libs/controllers')]
      ]
    });
  },
  {
    name: 'fastify-cms',
    dependencies: ['fastify-sequelize']
  }
);
