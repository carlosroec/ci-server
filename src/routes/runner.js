const express = require('express');
const { Docker } = require('node-docker-api');

const router = express.Router();

const promisifyStream = stream => new Promise((resolve, reject) => {
    stream.on('data', data => console.log(data.toString()))
    stream.on('end', resolve)
    stream.on('error', reject)
});

const runContainer = async (req, res) => {
    try {
        const { image } = req.params;

        const docker = new Docker({ socketPath: '/var/run/docker.sock' });

        // construimos el container en base a la imagen indicada
        const containerName = `ci-${Math.floor(Math.random() * 1000)}`;
        const container = await docker.container.create({
            "Image": image,
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

        res.json({
            status: 'done'
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            error: err
        });
    }
}

router.post('/run-container/:image', runContainer);

module.exports = router;
