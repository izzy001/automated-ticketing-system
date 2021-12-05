const express = require('express');
const router = express.Router();
const ticket = require('../controllers/tickets')

//all ticket routes
router.post('/', ticket.buyTicket);
router.post('/validate', ticket.validateTripTicket)
router.post('/end-trip', ticket.completedTrip);
router.get('/:id', ticket.getTripHistory)

module.exports = router;