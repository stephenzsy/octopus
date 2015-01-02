(function () {
    'use strict';

    angular.module('hydra')
        .controller('ArticleSourceController', function ($scope, $routeParams, KrakenService, ArticleSources) {
            $scope.breadcrumb = [];

            var articleSourceId = $routeParams['article_source_id'];
            var request = new Kraken.GetArticleSourceRequest({
                ArticleSourceId: articleSourceId
            });
            var x = KrakenService.GetArticleSource(request)
                .then(function (articleSource) {
                    $scope.ArticleSource = articleSource;
                    ArticleSources.set(request.ArticleSourceId, $scope.ArticleSource);
                    $scope.breadcrumb = [{
                        display: articleSource.Name,
                        // url: '/article_source/' + articleSource.Id,
                        active: true
                    }];
                });

            var listArchiveDailyIndicesRequest = new Kraken.ListArchiveDailyIndicesRequest({
                ArticleSourceId: articleSourceId
            });

            KrakenService.ListArchiveDailyIndices(listArchiveDailyIndicesRequest)
                .then(function (archiveDailyIndices) {
                    $scope.dailyIndices = archiveDailyIndices;
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