const mongoose = require('mongoose');
const tripSchema = new mongoose.Schema({
    serial_number: {
        type: String
    },
    trip_history: [
        {
            trip_type: { type: String },
            trip_destination: { type: String },
            trip_fare: { type: String },
            trip_date: { type: Date }
        }
    ]
},
    {
        timestamps: true
    });

//create schema for trip
const TripHistory = new mongoose.model('TripHistory', tripSchema);
exports.TripHistory = TripHistory;

