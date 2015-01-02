(function () {
    'use strict';

    var app = angular.module('krakenClient', []);

    app.service('KrakenService', function ($window, SERVICE_URL, $q) {
        var Thrift = $window.Thrift;
        var Kraken = $window.Kraken;

        var transport = new Thrift.Transport(SERVICE_URL);
        var protocol = new Thrift.Protocol(transport);
        var client = new Kraken.KrakenServiceClient(protocol);

        function handler0Arg(method) {
            return function () {
                var deferred = $q.defer();
                client[method](function () {
                }).then(function (result) {
                    deferred.resolve(result);
                }, function (xhr, status, err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            }
        }

        function handler1Arg(method) {
            return function (arg) {
                var deferred = $q.defer();
                client[method](arg, function () {
                }).then(function (result) {
                    deferred.resolve(result);
                }, function (xhr, status, err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            }
        }

        return {
            ListArticleSources: handler0Arg('ListArticleSources'),
            GetArticleSource: handler1Arg('GetArticleSource'),
            ListArchiveDailyIndices: handler1Arg('ListArchiveDailyIndices'),
            GetArchiveDailyIndex: handler1Arg('GetArchiveDailyIndex'),
            GetImportedDocument: handler1Arg('GetImportedDocument'),
            ImportDocument: handler1Arg('ImportDocument'),
            ParseArchiveDailyIndex: handler1Arg('ParseArchiveDailyIndex')
        };
    });
})();