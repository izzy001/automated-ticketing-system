const winston = require('winston');
const express = require('express');
const config = require('config');
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/prod')(app);

const port = config.get('PORT') || 8002;
const server = app.listen(port, () => winston.info(`listening on ${port}...`));

module.exports = server;
