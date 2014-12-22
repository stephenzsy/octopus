var util = require('util');
var Kraken = require('kraken-model').Types;

var GenericHandler = require('./generic_handler');
var ArticleSources = require('../article_sources');
var HttpExternalRepository = require("../document_repository/http_external_repository");

(function () {
    "use strict";

    var httpExternalRepository = new HttpExternalRepository();

    function ImportDocument() {
        GenericHandler.call(this);
    }

    util.inherits(ImportDocument, GenericHandler);

    ImportDocument.prototype.getMethodName = function () {
        return 'ImportDocument';
    };

    ImportDocument.prototype.enact = function (/*ImportDocumentRequest*/ request) {
        var articleSourceId = request.ArticleSourceId;
        var articleSource = ArticleSources[articleSourceId];
        if (!articleSource) {
            var e = new Kraken.InvalidArticleSourceIdNotFound();
            e.ArticleSourceId = request.ArticleSourceId;
            e.errorCode = 'InvalidArticleSourceId.NotFound';
            e.message = "Invalid article source ID provided: " + articleSourceId;
            throw e;
        }

        // resolve url
        var url = null;
        if (request.DocumentType == Kraken.TYPE_DAILY_INDEX) {
            url = articleSource.getArchiveDailyIndexUrlForId(request.DocumentId);
        }

        httpExternalRepository.retrieveDocument(url, function (data) {
            console.log(data);
        });

        var result = new Kraken.ImportDocumentResult();
        return result;
    };

    var handler = module.exports = new ImportDocument().handler;
})();
