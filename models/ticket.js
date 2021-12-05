const mongoose = require('mongoose');
const Joi = require('joi');

const ticketSchema = new mongoose.Schema({
    serial_number: {
        type: String,
        unique: true,
    },
    ticket_balance: { type: Number },
    last_trip_type: { type: String, default: '' },
    last_trip_destination: { type: String, default: '', lowercase: true },
    last_trip_fare: { type: String, default: '' }
},
    {
        timestamps: true
    });

//create schema for ticket
const Ticket = new mongoose.model('Ticket', ticketSchema);

function validateNewTicket(ticket) {
    const schema = Joi.object({
        amount: Joi.number().min(10).required()
    });
    return schema.validate(ticket);
}

function validateTicket(ticket) {
    const schema = Joi.object({
        serial_number: Joi.string().min(14).max(14)
    });
    return schema.validate(ticket);
};

function validateEndTrip(ticket) {
    const schema = Joi.object({
        serial_number: Joi.string().min(14).max(14).required(),
        trip_fare: Joi.number().min(4.25).required(),
        destination: Joi.string().required(),
        trip_type: Joi.string().valid('one-way', 'round').required()
    });
    return schema.validate(ticket);
};

exports.Ticket = Ticket;
exports.validateNewTicket = validateNewTicket;
exports.validateTicket = validateTicket;
exports.validateEndTrip = validateEndTrip;
