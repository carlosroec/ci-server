const { Docker } = require('node-docker-api');
const GithubWebHook = require('express-github-webhook');

const webhookHandler = GithubWebHook({ path: '/api/webhook', secret: 'jdhhhf465hsdjh' });
const promisifyStream = stream => new Promise((resolve, reject) => {
    stream.on('data', data => console.log(data.toString()))
    stream.on('end', resolve)
    stream.on('error', reject)
});

webhookHandler.on('*', function (event, repo, data) {
    const docker = new Docker({ socketPath: '/var/run/docker.sock' });
    
    // construimos el container en base a la imagen indicada
    const containerName = `ci-${Math.floor(Math.random() * 1000)}`;
    const container = await docker.container.create({
        "Image": repo,
        "name": containerName
    });

    // arrancamos el container y sus pruebas
    await container.start();

    const logsStream = await container.logs({
        follow: true,
        stdout: true,
        stderr: true,
        timestamps: true,
    });

    await promisifyStream(logsStream);

    // eliminamos el container luego de ejecutar las pruebas
    await container.delete({ force: true });
});

module.exports = webhookHandler;