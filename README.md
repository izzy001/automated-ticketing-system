## About BART Ticketing System

a ticket system for residents using the bay arena rapid transit

## About The Codebase

This codebase is the **REST API** for a Ticketing app. The staging version of the API is hosted [here](https://bart-ticketing-system.herokuapp.com/).

## Technology Used

- NodeJS
- MongoDB
- Express
- Jest(testing)

## Setup

To setup the app,

1. Clone the app to your local machine and run `npm install`
2. Then run `npm start`

## Running tests
run `npm test`


## Folder Structure

```
bart-ticketing-system-api/
  .github
  node_modules/
  config/
        custom-environment-variables.json
        default.json
        test.json
  controllers/
        tickets.js
  middleware/
        error.js
  models/
        ticket.js
        trip-record.js
  routes/
        ticket-route.js
  startup/
        db.js
        logging.js
        prod.js
        routes.js
  tests/
        integration/
                tickets.test.js
  .gitignore
  index.js
  LICENSE
  package.json
  README.md
```


## Config Set up 

If you are deploying to production, you would need provide the following ENV variable on your server

```
db='mongo-connection-string'
port='80xx'
```

## How to contribute

You can start contributing to the codebase once you're done with your local setup.

## Rest API Documentation

Once you're done setting up, you can read about the `endpoints` on postman.
At the moment the API documentation is hosted on Postman:<br>
[![Run in Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/5974922/UVJhEF3Z#16ec41f4-6c10-49a1-8ffb-7e19855cfbae)

