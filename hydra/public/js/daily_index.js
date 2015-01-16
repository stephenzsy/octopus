(function () {
    'use strict';

    angular.module('hydra')
        .controller('DailyIndexController', function ($scope, $routeParams, KrakenService, ArticleSources) {

            function handleArticleDailyIndex(articleDailyIndex) {
                $scope.articleDailyIndex = articleDailyIndex;
                $scope.status = 'OK';
            }

            var request = new Kraken.GenericDocumentRequest();
            request.ArticleSourceId = $routeParams['article_source_id'];
            request.DocumentType = Kraken.TYPE_DAILY_INDEX;
            $scope.dailyIndexId = request.DocumentId = $routeParams['daily_index_id'];

            function setBreadcurmb(articleSource) {
                $scope.breadcrumb = [{
                    display: articleSource.Name,
                    url: '/article_source/' + articleSource.Id,
                    active: false
                }, {
                    display: $scope.dailyIndexId,
                    active: true
                }];
            }

            var articleSource = ArticleSources.get(request.ArticleSourceId);
            if (articleSource) {
                setBreadcurmb(articleSource);
            } else {
                var getArticleSourceRequest = new Kraken.GetArticleSourceRequest();
                getArticleSourceRequest.ArticleSourceId = $routeParams['article_source_id'];
                KrakenService.GetArticleSource(getArticleSourceRequest)
                    .then(setBreadcurmb);
            }

            function importAndParse() {
                return KrakenService.ImportDocument(request)
                    .then(function () {
                        return KrakenService.ParseArchiveDailyIndex(request);
                    }).then(handleArticleDailyIndex);
            }

            KrakenService.GetArchiveDailyIndex(request)
                .then(handleArticleDailyIndex, function (err) {
                    if (err instanceof Kraken.DocumentExpiredError) {
                        return importAndParse();
                    }
                    if (err instanceof Kraken.ValidationError && err.ErrorCode === Kraken.ERROR_CODE_INVALID_DOCUMENT_ID_NOT_PARSED) {
                        $scope.status = 'NotParsed';

                        // check if it is imported
                        return KrakenService.ParseArchiveDailyIndex(request)
                            .then(handleArticleDailyIndex, function (err) {
                                // not imported, import
                                if (err instanceof Kraken.ValidationError && err.ErrorCode === Kraken.ERROR_CODE_INVALID_DOCUMENT_ID_NOT_IMPORTED) {
                                    $scope.status = 'NotImported';
                                    return importAndParse();
                                }
                                throw err;
                            });
                    }
                    throw err;
                });
        });
})();