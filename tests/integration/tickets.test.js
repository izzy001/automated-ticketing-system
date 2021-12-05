const mongoose = require('mongoose');
const request = require('supertest');
const { Ticket } = require('../../models/ticket');
const { TripHistory } = require('../../models/trip-record');

let server;

describe('/api/tickets', () => {
    let server;
    let amount;
    let serial_number;
    let ticket;
    let trip_fare;
    let destination;
    let trip_type;

    beforeEach(async () => {
        server = require('../../index');
        amount = 200;
        ticket = new Ticket({
            serial_number: 'BART-089943921',
            ticket_balance: 100,
            last_trip_type: '',
            last_trip_destination: '',
            last_trip_fare: ''
        });
        await ticket.save();

    });

    afterEach(async () => {
        await server.close();
        await Ticket.deleteMany({});
        await TripHistory.deleteMany({});
    });

    describe('POST /', () => {
        const exec = async () => {
            return await request(server)
                .post('/api/tickets')
                .send({ amount });
        };

        it('should return 400 if amount is invalid', async () => {
            amount = '';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if amount is less than $10', async () => {
            amount = 2;
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 200 if ticket is successfully purchased', async () => {
            amount = 10;
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('serial_number');
        });

    });

    describe('POST /validate', () => {

        const exec = async () => {
            return await request(server)
                .post('/api/tickets/validate')
                .send({ serial_number });
        };

        it('should return 400 if ticket serial number is invalid', async () => {
            serial_number = 'BART-12345678';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 404 if ticket is not found in the system', async () => {
            serial_number = 'BART-123456789';
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should return 200 if ticket is valid and ticket balance is sufficient to make a trip', async () => {
            serial_number = 'BART-089943921';
            const res = await exec();
            expect(res.status).toBe(200);
        });
    });

    describe('POST /end-trip', () => {
        const exec = async () => {
            return await request(server)
                .post('/api/tickets/end-trip')
                .send({
                    serial_number,
                    trip_fare,
                    destination,
                    trip_type
                });
        }

        it('should return 400, if trip details is invalid', async () => {
            serial_number = 'BART-089943921';
            trip_fare = 10;
            destination = "Montgomery";

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 404, if ticket is not in the system', async () => {
            serial_number = 'BART-089943922';
            trip_fare = 10;
            destination = "Montgomery";
            trip_type = "one-way";

            const res = await exec();
            expect(res.status).toBe(404)
        });

        it('should return add funds, if ticket balance is insufficient to end the trip', async () => {
            serial_number = 'BART-089943921';
            trip_fare = 120;
            destination = "Montgomery";
            trip_type = "one-way";
            const res = await exec();
            // console.log(res)
            let new_ticket_balance = ticket.ticket_balance - trip_fare;
            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Add funds');
            expect(new_ticket_balance).toBeLessThan(ticket.ticket_balance);
            expect(new_ticket_balance).toBeLessThan(0);
            //come back to you
        });

        it('should complete ticket cycle, if ticket with zero balance is consumed', async () => {
            serial_number = 'BART-089943921';
            trip_fare = 100;
            destination = "Montgomery";
            trip_type = "one-way";
            const res = await exec();
            let new_ticket_balance = ticket.ticket_balance - trip_fare;
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Thank you for riding with us.')
            expect(new_ticket_balance).toEqual(0);
        });

        it('should return new ticket, it new_ticket_balance is greater than 0', async () => {
            serial_number = 'BART-089943921';
            trip_fare = 10;
            destination = "Montgomery";
            trip_type = "one-way";
            const res = await exec();
            let new_ticket_balance = ticket.ticket_balance - trip_fare;
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Trip ended successfully')
            expect(new_ticket_balance).toBeGreaterThan(0);
        })


    });

    describe('GET /:id', () => {

        beforeEach(async () => {
            server = require('../../index');
            amount = 200;
            tripHistory = new TripHistory({
                serial_number: 'BART-089943921',
                trip_history: [
                    {
                        trip_type: "round",
                        trip_destination: "South San Francisco",
                        trip_fare: "14.8",
                        trip_date: "2021-12-03T14:42:49.000Z",
                        _id: "61aa2ce928717ac541d0307e"
                    }
                ]
            });
            await tripHistory.save();

        });


        it('should return 200 if trip record is retrieved successfully', async () => {
            const exec = async () => {
                return await request(server)
                    .get('/api/tickets/' + tripHistory.serial_number)
            }
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body.details.serial_number === 'BART-089943921')
            expect(res.body.details).toHaveProperty('trip_history');
            expect(res.body.details.trip_history.some(t => t.trip_fare === "14.8")).toBeTruthy();
        });

        it('should return 404 if trip record is not found for ticket', async () => {
            let newTripHistorySerialNumber = 'BART-123456789';
            const exec = async () => {
                return await request(server)
                    .get('/api/tickets/' + newTripHistorySerialNumber)
            }
            const res = await exec();
            expect(res.status).toBe(404);

        });
    });

})