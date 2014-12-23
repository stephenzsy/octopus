var Kraken = require('kraken-model').Types;

var ArticleSources = require('../../article_sources');

(function () {
    "use strict";

    function validateArticleSourceId(articleSourceId) {
        var articleSource = ArticleSources[articleSourceId];
        if (!articleSource) {
            var e = new Kraken.ValidationError();
            e.errorCode = 'InvalidArticleSourceId.NotFound';
            e.message = "Invalid article source ID provided: " + articleSourceId;
            throw e;
        }
        return articleSource;
    }

    module.exports = {
        validateArticleSourceId: validateArticleSourceId,
        validateImportDocumentRequest: function (/* Kraken.ImportDocumentRequest */ request) {
            var articleSource = validateArticleSourceId(request.ArticleSourceId);
            var documentType = null;
            if (request.DocumentType === Kraken.TYPE_DAILY_INDEX) {
                documentType = Kraken.TYPE_DAILY_INDEX;
            } else {
                throw new Kraken.ValidationError({
                    errorCode: "InvalidDocumentType.NotFound",
                    message: "Invalid document type provided: " + request.DocumenType
                })
            }
            return {
                articleSource: articleSource,
                documenType: documentType,
                documentId: request.DocumentId
            };
        }
    };
})();