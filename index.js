const winston = require('winston');
const express = require('express');
const config = require('config');
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/prod')(app);

const port = process.env.PORT || config.get('PORT') || 8002;

app.get("/", (_, res) =>{
    return res.send({
          msg: "Hello Bart Ticketing System",
          Time: new Date(),
          status: "running",
          server: "Node + Express Server"
        });
});
const server = app.listen(port, () => winston.info(`listening on ${port}...`));

module.exports = server;
