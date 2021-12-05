const { Ticket,
    validateNewTicket,
    validateTicket,
    validateEndTrip } = require('../models/ticket');
const { TripHistory } = require('../models/trip-record');
const moment = require('moment');

exports.buyTicket = async (req, res) => {
    //validate value
    const { error } = validateNewTicket(req.body);
    if (error) return res.status(400).send({
        message: 'Unable to purchase a ticket',
        validation_error: error.details[0].message
    });

    let generateSerialNumber = Math.random().toString().slice(2, 11);
    let newTicket = new Ticket({
        serial_number: `BART-${generateSerialNumber}`,
        ticket_balance: req.body.amount
    });
    newTicket = await newTicket.save();
    let newTripRecord = new TripHistory({
        serial_number: `BART-${generateSerialNumber}`
    })
    newTripRecord = await newTripRecord.save();
    res.send(newTicket);
}

exports.validateTripTicket = async (req, res) => {
    const { error } = validateTicket(req.body);
    if (error) return res.status(400).send({
        message: 'Invalid Ticket',
        validation_error: error.details[0].message
    });

    //check if ticket exist
    let ticket = await Ticket.findOne({ serial_number: req.body.serial_number });
    if (!ticket) return res.status(404).send({
        message: 'Ticket not found in system, Kindly go to the kiosk to purchase a new ticket'
    });

    if (ticket.ticket_balance < 4.15) return res.status(401).send({
        message: 'Ticket balance is not sufficient to make a trip'
    });

    res.send({
        message: 'Ticket is valid! Proceed to your coach'
    });
}


exports.completedTrip = async (req, res) => {
    //req.body: serial_number,destination, trip_type, trip_fare

    const { error } = validateEndTrip(req.body);
    if (error) return res.status(400).send({
        message: 'Invalid Trip Details',
        validation_error: error.details[0].message
    });

    //check if ticket exist
    let ticket = await Ticket.findOne({ serial_number: req.body.serial_number });
    if (!ticket) return res.status(404).send({
        message: 'Ticket not found in system, Kindly use a valid ticket'
    });

    newTicketBalance = ticket.ticket_balance - req.body.trip_fare;
    if (newTicketBalance < 0) return res.status(401).send({
        message: 'Add funds'
    });

    if (newTicketBalance === 0) {
        const newTicket = await Ticket.findOneAndUpdate({
            'serial_number': req.body.serial_number
        },
            {
                $set: {
                    'ticket_balance': newTicketBalance,
                    'last_trip_type': req.body.trip_type,
                    'last_trip_destination': req.body.destination,
                    'last_trip_fare': req.body.trip_fare
                }
            },
            { new: true });

        let trip_details = {
            trip_type: req.body.trip_type,
            trip_destination: req.body.destination,
            trip_fare: req.body.trip_fare,
            trip_date: moment().format()

        }

        await TripHistory.findOneAndUpdate({
            'serial_number': req.body.serial_number
        },
            { $addToSet: { trip_history: trip_details } },
            { safe: true, multi: true, new: true })

        return res.send({
            message: 'Thank you for riding with us.',
            details: newTicket
        });
    }

    if (newTicketBalance > 0) {
        const newTicket = await Ticket.findOneAndUpdate({
            'serial_number': req.body.serial_number
        },
            {
                $set: {
                    'ticket_balance': newTicketBalance.toFixed(2),
                    'last_trip_type': req.body.trip_type,
                    'last_trip_destination': req.body.destination,
                    'last_trip_fare': req.body.trip_fare
                }
            },
            { new: true });

        let trip_details = {
            trip_type: req.body.trip_type,
            trip_destination: req.body.destination,
            trip_fare: req.body.trip_fare,
            trip_date: moment().format()

        }

        await TripHistory.findOneAndUpdate({
            'serial_number': req.body.serial_number
        },
            { $addToSet: { trip_history: trip_details } },
            { safe: true, multi: true, new: true })


        res.send({
            message: 'Trip ended successfully',
            details: newTicket
        })
    }
}


exports.getTripHistory = async (req, res) => {
    const tripRecord = await TripHistory.findOne({ serial_number: req.params.id });
    if (!tripRecord) return res.status(404).send('There is no trip history ');
    res.send({
        message: 'Trip history successfully retrieved',
        details: tripRecord
    });
}
