'use strict';

var thrift = require('thrift');

var KrakenService = require('./model/gen-nodejs/KrakenService');
var ttypes = require('./model/gen-nodejs/kraken_types');

var protocol = thrift.TJSONProtocol();

var data = {};

module.exports = thrift.createServer(KrakenService, {
    ping: function (result) {
        console.log("ping()");
        result(null);
    }
}, {protocol: protocol});

