const winston = require('winston');
// require('winston-mongodb');
require('express-async-errors');

module.exports = function () {

    winston.exceptions.handle(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: './logs/uncaughtExceptions.log' })
    );
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });



    // add log transport to routes
    winston.add(new winston.transports.File({ filename: './logs/logfile.log' }));
    winston.add(new winston.transports.Console({ colorize: true, prettyPrint: true }));
}