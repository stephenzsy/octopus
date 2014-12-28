(function () {
    'use strict';

    angular.module('hydra')
        .controller('DailyIndexController', function ($scope, $routeParams, KrakenService) {
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
                var request = new Kraken.GenericDocumentRequest();
                request.ArticleSourceId = dailyIndex.ArticleSourceId;
                request.DocumentType = Kraken.TYPE_DAILY_INDEX;
                request.DocumentId = dailyIndex.ArchiveDailyIndexId;
                KrakenService.ImportDocument(request, function () {
                }).then(function (/* Kraken.ImportedDocument */ importedDocument) {
                    dailyIndex.Status = importedDocument.Status;
                    $scope.$apply();
                });
            };

            $scope.getImportedDailyIndexDocument = function (dailyIndex) {
                var request = new Kraken.GenericDocumentRequest();
                request.ArticleSourceId = dailyIndex.ArticleSourceId;
                request.DocumentType = Kraken.TYPE_DAILY_INDEX;
                request.DocumentId = dailyIndex.ArchiveDailyIndexId;
                KrakenService.GetImportedDocument(request, function () {
                }).then(function (/* Kraken.ImportDocumentResult */ result) {
                    console.log(result);
                });
            };

            $scope.parseDailyIndex = function (dailyIndex) {
                var request = new Kraken.GenericDocumentRequest();
                request.ArticleSourceId = dailyIndex.ArticleSourceId;
                request.DocumentType = Kraken.TYPE_DAILY_INDEX;
                request.DocumentId = dailyIndex.ArchiveDailyIndexId;
                KrakenService.ParseArchiveDailyIndex(request, function () {
                }).then(function (/* Kraken.ParseArchiveDailyIndexResult */ result) {
                    console.log(result);
                });
            }
        });
})();