const GithubWebHook = require('express-github-webhook');
const webhookHandler = GithubWebHook({ path: '/api/webhook', secret: 'jdhhhf465hsdjh' });

webhookHandler.on('*', function (event, repo, data) {
    console.log(event);
    console.log("----------");
    console.log(repo);
    console.log("=========");
    console.log(data);
});

module.exports = webhookHandler;