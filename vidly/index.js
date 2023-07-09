const Joi = require('joi');
require('express-async-errors');
require('winston-mongodb');
const winston = require('winston');
const config = require('config');
const users = require('./routes/users');
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const auth = require('./routes/auth');
const error = require('./middleware/error');
const express = require('express');
const app = express();

// Handling Unhandled Exceptions. This works with only synchronous code
process.on('uncaughtException', (ex) => {
    console.log("We got an uncaught exception");
    winston.error(ex.message, ex);
    process.exit(1);
});

// Handling uncaught promises.
process.on('unhandledRejection', (ex) => {
    console.log("We got an unhandled rejection");
    winston.error(ex.message, ex);
    process.exit(1);
});

// winston.add(winston.transports.File, { filename: 'logfile.log' });
// winston.add(winston.transports.MongoDB, { db: "mongodb://localhost/vidly", level: 'error'});

// Example of an unhandled exception
throw new Error("Something failed during startup");

// Example of a rejected Promise (Result of an async operation like a call to database or remote http service
const p = Promise.reject(new Error("Something failed miserably"));
p.then(() => console.log("Done"));


if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

// Error middleware
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));