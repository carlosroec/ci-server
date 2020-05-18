const express = require('express');
const bodyParser = require('body-parser');

const runnerRouter = require('./src/routes/runner');
const managerRouter = require('./src/routes/manager');
const healthRouter = require('./src/routes/health');
const webhookHandler = require('./src/routes/webhook');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(webhookHandler);
app.use('/api', runnerRouter);
app.use('/api', managerRouter);
app.use('/api', healthRouter);

app.listen(3000, '0.0.0.0', () => {
    console.log("Listening on port: 3000");
});
