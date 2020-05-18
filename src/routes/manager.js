const express = require('express');
const { Docker } = require('node-docker-api');
const tar = require('tar-fs');

const router = express.Router();

const promisifyStream = stream => new Promise((resolve, reject) => {
    stream.on('data', data => console.log(data.toString()))
    stream.on('end', resolve)
    stream.on('error', reject)
});

const buildImage = async (req, res) => {
    try {
        const { image, repository } = req.body;

        const docker = new Docker({ socketPath: '/var/run/docker.sock' });
        const tarStream = tar.pack(`./src/docker-images/${image.version}`);
        const stream = await docker.image.build(tarStream, {
            t: image.name,
            buildargs: {
                REPO_URL: repository.url,
                REPO_NAME: repository.name
            }
        });
        
        await promisifyStream(stream);

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

const buildContainer = async (req, res) => {
    try {
        const { image, container } = req.body;
        
        const docker = new Docker({ socketPath: '/var/run/docker.sock' });

        await docker.container.create({
            "Image": image.name,
            "name": container.name
        });

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

const deleteContainer = async (req, res) => {
    try {
        const { name } = req.body;
        const container = await docker.container.get(name);

        await container.delete({ force: true });

        res.json({
            status: 'deleted'
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            error: err
        });
    }
}

router.post('/build-image', buildImage);
router.post('/build-container', buildContainer);
router.post('delete-container', deleteContainer);

module.exports = router;
