'use strict';

var thrift = require('thrift');

var KrakenService = require('kraken-model').Service;

module.exports = thrift.createWebServer({
    cors: {'*': true},
    services: {
        '/': {
            processor: KrakenService,
            handler: require('./lib/kraken/handler'),
            protocol: thrift.TJSONProtocol
        }
    }
});

