(function () {
    'use strict';

    angular.module('hydra')
        .controller('DailyIndexController', function ($scope, $routeParams, KrakenService) {
            $scope.breadcrumb = [];

            var request = new Kraken.GenericDocumentRequest();
            request.ArticleSourceId = $routeParams['article_source_id'];
            request.DocumentType = Kraken.TYPE_DAILY_INDEX;
            $scope.dailyIndexId = request.DocumentId = $routeParams['daily_index_id'];
            var x = KrakenService.GetArchiveDailyIndex(request, function () {
            }).then(function (data) {
                $scope.articleDailyIndex = data;
                $scope.$apply();
            }, function (xhr, status, err) {
                console.dir(xhr);
                console.dir(status);
                console.dir(err);
            });
        });
})();