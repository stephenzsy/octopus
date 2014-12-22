(function () {
    'use strict';

    angular.module('hydra')
        .controller('ArticleSourceController', function ($scope, $routeParams, KrakenService) {
            $scope.breadcrumb = [];

            var request = new Kraken.GetArticleSourceRequest();
            request.ArticleSourceId = $routeParams['article_source_id'];
            var x = KrakenService.GetArticleSource(request, function () {
            }).then(function (data) {
                $scope.ArticleSource = data;
                $scope.$apply();
                var listArchiveDailyIndicesRequest = new Kraken.ListArchiveDailyIndicesRequest();
                listArchiveDailyIndicesRequest.ArticleSourceId = data.Id;
                return KrakenService.ListArchiveDailyIndices(listArchiveDailyIndicesRequest);
            }, function (xhr, status, err) {
                console.dir(xhr);
                console.dir(status);
                console.dir(err);
            }).then(function (data) {
                $scope.dailyIndices = data;
                $scope.$apply();
            }, function (xhr, status, err) {
                console.dir(xhr);
                console.dir(status);
                console.dir(err);
            });

            $scope.importDailyIndexDocument = function (dailyIndex) {
                var request = new Kraken.ImportDocumentRequest();
                request.ArticleSourceId = dailyIndex.ArticleSourceId;
                request.DocumentType = Kraken.TYPE_DAILY_INDEX;
                request.DocumentId = dailyIndex.ArchiveDailyIndexId;
                KrakenService.ImportDocument(request, function () {
                }).then(function (data) {
                    console.log(data);
                });
            };
        });
})();