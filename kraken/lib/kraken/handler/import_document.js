var util = require('util');
var Kraken = require('kraken-model').Types;
var Q = require('q');

var GenericHandler = require('./generic_handler');
var HttpExternalRepository = require("../document_repository/http_external_repository");
var InputValidators = require("./util/input_validators");

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

    ImportDocument.prototype.enact = function (/*Kraken.ImportDocumentRequest*/ request) {
        var validated = InputValidators.validateImportDocumentRequest(request);

        // resolve url
        var url = null;
        if (request.DocumentType == Kraken.TYPE_DAILY_INDEX) {
            url = validated.articleSource.getArchiveDailyIndexUrlForId(request.DocumentId);
        }

        return httpExternalRepository.retrieveDocument(url)
            .then(function (documentContent) {
                var doc = new Kraken.ImportedDocument();
                doc.ArticleSourceId = validated.articleSource.getId();
                doc.ImportDateTime = new Date().toISOString();
                doc.Id = request.DocumentId;
                doc.SourceUrl = url;
                doc.DocumentContent = documentContent;
                return new Kraken.ImportDocumentResult({Status: Kraken.STATUS_IMPORTED, ImportedDocument: doc});
            });
    };

    ImportDocument.prototype.isAsync = function () {
        return true;
    };

    var handler = module.exports = new ImportDocument().handler;
})();
