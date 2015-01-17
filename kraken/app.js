'use strict';

var serverFactory = require('./lib/kraken/server/auth_enabled_web_json_server');

var KrakenService = require('kraken-model').Service;

module.exports = serverFactory.createWebServer({
    cors: {'*': true},
    services: {
        '/': {
            processor: KrakenService,
            handler: require('./lib/kraken/handler')
        }
    }
});

