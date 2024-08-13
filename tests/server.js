const path = require('path');
const fastify = require('fastify')({
  logger: true, querystringParser: str => require('qs').parse(str)
});

const sqliteStorage = path.resolve('./tests/database.sqlite');

fastify.register(require('@kne/fastify-sequelize'), {
  db: {
    storage: sqliteStorage
  }, modelsGlobOptions: {
    syncOptions: {}
  }, prefix: 't_cms'
});


fastify.register(require('../index'), {});

fastify.register(require('fastify-plugin')(async (fastify) => {
  await fastify.sequelize.sync();
}));

fastify.register(require('@kne/fastify-response-data-format'));

fastify.listen({ port: 8047 }, (err, address) => {
  if (err) throw err;
  // Server is now listening on ${address}
});
