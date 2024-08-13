const fastify = require('fastify')({
    querystringParser: str => require('qs').parse(str)
});

const packageJson = require('./package.json');

const { promises: fs } = require('fs');
const path = require('path');

fastify.register(require('@fastify/swagger'), {
    openapi: {
        info: {
            title: '内容发布管理', description: '内容发布管理', version: packageJson.version
        }, components: {}
    }
});


fastify.register(require('@kne/fastify-sequelize'));

fastify.register(require('./index'));

fastify.register(require('fastify-plugin')(async (fastify) => {
    await fastify.sequelize.sync();
}));

fastify.register(require('@kne/fastify-response-data-format'));

fastify.ready().then(async () => {
    const api = fastify.swagger();
    await fs.writeFile(path.resolve(__dirname, './open-api.json'), JSON.stringify(api, null, 2));
});

