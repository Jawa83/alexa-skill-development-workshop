const Alexa = require('alexa-sdk');
let https = require('https');

const WELCOME_MESSAGE = 'Welcome to High Low guessing game. Would you like to play?';
const START_MESSAGE = 'Great! Try saying a number to start the game.';
const EXIT_SKILL_MESSAGE = 'Bye Bye';
const HELP_MESSAGE = 'Say a number.';

const states = {
    START: '_START',
    GUESS: '_GUESS'
};

module.exports.handlers = {
    LaunchRequest() {
        this.handler.state = states.START;
        this.emitWithState('Start');
    },
    Unhandled() {
        this.handler.state = states.START;
        this.emitWithState('Start');
    }
};

module.exports.startHandlers = Alexa.CreateStateHandler(states.START, {
    Start() {
        this.emit(':ask', WELCOME_MESSAGE, HELP_MESSAGE);
    },
    'AMAZON.YesIntent': function () {
        this.attributes['result'] = Math.floor(Math.random() * 100);
        this.handler.state = states.GUESS;
        this.emit(':ask', START_MESSAGE, START_MESSAGE);
    },
    'AMAZON.NoIntent': function () {
        this.emit(':tell', EXIT_SKILL_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', EXIT_SKILL_MESSAGE);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', EXIT_SKILL_MESSAGE);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', HELP_MESSAGE, HELP_MESSAGE);
    },
    Unhandled() {
        this.emitWithState('Start');
    }
});

module.exports.guessHandlers = Alexa.CreateStateHandler(states.GUESS, {
    'httpIntent': function() {
        // let mydata = this.event.request.intent.slots.mydata.value;
        // console.log('mydata:', mydata);
        let responseString = '';

        var resultCallback = function (res) {
            var response = responseString;
            console.log('==> Answering: ', response);
            console.log('test: ' + response[0]);
            this.emit(':tell', 'The answer is');
        }

        https.get('https://finance.google.com/finance/info?client=ig&q=NASDAQ:MSFT', (res) => {
            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);

            res.on('data', (d) => {
                responseString += d;
            });

            res.on('end', resultCallback);
        }).on('error', (e) => {
            console.error(e);
        });
    },
    'NumberGuessIntent': function() {
        var guessNum = parseInt(this.event.request.intent.slots.number.value);
        var targetNum = this.attributes['result'];

        if (guessNum > targetNum) {
            this.emit(':ask', 'The number is too high', 'The number is too high');
        } else if( guessNum < targetNum){
            this.emit(':ask', 'The number is too low', 'The number is too low');
        } else if (guessNum === targetNum){
            // With a callback, use the arrow function to preserve the correct 'this' context
            this.handler.state = states.START;
            this.emit(':ask', guessNum.toString() + ' is correct! Would you like to play a new game?',
                'Say yes to start a new game, or no to end the game.');
        } else {
            this.emit(':ask', 'That is not a number, try again');
        }
    },
    Unhandled() {
        this.emit(':tell', 'Unhandled');
    }
});
