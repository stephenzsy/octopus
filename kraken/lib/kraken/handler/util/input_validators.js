var Kraken = require('kraken-model').Types;

var ArticleSources = require('../../article_sources');

(function () {
    "use strict";

    function validateArticleSourceId(articleSourceId) {
        var articleSource = ArticleSources[articleSourceId];
        if (!articleSource) {
            var e = new Kraken.ValidationError();
            e.ErrorCode = 'InvalidArticleSourceId.NotFound';
            e.Message = "Invalid article source ID provided: " + articleSourceId;
            throw e;
        }
        return articleSource;
    }

    module.exports = {
        validateArticleSourceId: validateArticleSourceId,
        validateGenericDocumentRequest: function (/* Kraken.GenericDocumentRequest */ request) {
            var articleSource = validateArticleSourceId(request.ArticleSourceId);
            var documentType = null;
            if (request.DocumentType === Kraken.TYPE_DAILY_INDEX ||
                request.DocumentType === Kraken.TYPE_ARTICLE) {
                documentType = request.DocumentType;
            } else {
                throw new Kraken.ValidationError({
                    ErrorCode: "InvalidDocumentType.NotFound",
                    Message: "Invalid document type provided: " + request.DocumenType
                });
            }
            if (request.DocumentType === Kraken.TYPE_ARTICLE && !request.ArchiveBucket) {
                throw new Kraken.ValidationError({
                    ErrorCode: "InvalidRequest.NullArchiveBucket",
                    Message: "Archive bucket is null for document type: " + request.DocumenType
                });
            }
            return {
                articleSource: articleSource,
                documentType: documentType,
                documentId: request.DocumentId
            };
        }
    };
})();