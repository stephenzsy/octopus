(function () {
    'use strict';

    angular.module('hydra')
        .controller('DailyIndexController', function ($scope, $routeParams, KrakenService) {
            $scope.breadcrumb = [];

            function handleArticleDailyIndex(articleDailyIndex) {
                $scope.articleDailyIndex = articleDailyIndex;
                $scope.status = 'OK';
                $scope.$apply();
            }

            var request = new Kraken.GenericDocumentRequest();
            request.ArticleSourceId = $routeParams['article_source_id'];
            request.DocumentType = Kraken.TYPE_DAILY_INDEX;
            $scope.dailyIndexId = request.DocumentId = $routeParams['daily_index_id'];
            var x = KrakenService.GetArchiveDailyIndex(request, function () {
            }).then(handleArticleDailyIndex, function (xhr, status, err) {
                if (err instanceof Kraken.ValidationError) {
                    if (err.ErrorCode === 'InvalidDocumentId.NotParsed') {
                        $scope.status = 'NotParsed';
                        $scope.$apply();
                    } else {
                        console.error(err);
                    }
                } else {
                    console.error(err);
                }
            });

            $scope.parseDailyIndex = function () {
                KrakenService.ParseArchiveDailyIndex(request, function () {
                }).then(handleArticleDailyIndex, function (xhr, status, err) {
                    if (err instanceof Kraken.ValidationError) {
                        if (err.ErrorCode === 'InvalidDocumentId.NotImported') {
                            $scope.status = 'NotImported';
                            $scope.$apply();
                        } else {
                            console.error(err);
                        }
                    } else {
                        console.error(err);
                    }
                });
            };

            $scope.importDailyIndex = function () {
                KrakenService.ImportDocument(request, function () {
                }).then(function (/* Kraken.ImportedDocument */ importedDocument) {
                    $scope.status = null;
                    $scope.$apply();
                });
            };
        });
})();