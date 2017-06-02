const WELCOME_MESSAGE = 'Hello Ward!';

module.exports.handlers = {
    LaunchRequest() {
        this.emit(':tell', WELCOME_MESSAGE);
    }
};
