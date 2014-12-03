(function () {
    'use strict';

    var krakenClient = angular.module('krakenClient');

    angular.module('hydra')
        .controller('StatusController', function ($scope, SERVICE_URL, KrakenService) {
            $scope.krakenServiceUrl = SERVICE_URL;
            KrakenService.ping(function () {
            }).done(function () {
                $scope.pingStatus = 'ok';
            }).fail(function (xhr, status, err) {
                console.error(xhr);
                console.error(status);
                console.error(err);
            });
        });
})();