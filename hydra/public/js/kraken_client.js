(function () {
    'use strict';

    var app = angular.module('krakenClient', []);

    app.service('KrakenService', function (SERVICE_URL) {
        var transport = new Thrift.Transport('http://localhost:3000');
        var protocol = new Thrift.Protocol(transport);
        var client = new Kraken.KrakenServiceClient(protocol);

        return client;
    });
})();