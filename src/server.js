'use strict';

const Alexa = require('alexa-sdk');
const bodyParser = require('body-parser');
const express = require('express');

const handlers = require('./app');

const port = process.env.PORT || 3000;

// Initialize express server
const server = express();
server.use(bodyParser.json());

// Create POST route
server.post('/', (req, res) => {
    // Create dummy context with fail and succeed functions
    const context = {
        fail: () => {
            res.sendStatus(500);
        },
        succeed: data => {
            res.send(data);
        }
    };

    // Initialize Alexa SDK
    const alexa = Alexa.handler(req.body, context);
    alexa.registerHandlers(handlers.handlers, handlers.startHandlers, handlers.guessHandlers);

    alexa.execute();
});

// Start Express server
server.listen(port, () => {
    console.log(`alexa-skill-development-workshop listening on port ${port}!`);
});
