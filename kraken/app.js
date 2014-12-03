'use strict';

var thrift = require('thrift');

var KrakenService = require('./model/gen-nodejs/KrakenService');
var ttypes = require('./model/gen-nodejs/kraken_types');

var data = {};

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

