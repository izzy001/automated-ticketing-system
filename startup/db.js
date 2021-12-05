const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {
    //connect to mongodb
    const db = "mongodb://localhost/bart-ticketing-system";
    //const db = config.get('MONGODB_URI');
    mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() =>
            winston.info(`Connected to ${db} ...`));

}