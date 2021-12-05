const express = require('express');
const error = require('../middleware/error');
const ticketRouter = require('../routes/ticket-route');

module.exports = function (app) {
    app.use(express.json());
    app.use('/api/tickets', ticketRouter);
    //error middleware
    app.use(error);
}