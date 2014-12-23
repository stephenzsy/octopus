var util = require('util');
var Kraken = require('kraken-model').Types;
var Q = require('q');

var GenericHandler = require('./generic_handler');
var HttpExternalRepository = require("../document_repository/http_external_repository");
var AwsS3DocumentRepository = require('../document_repository/aws_s3_document_repository');
var InputValidators = require("./util/input_validators");

(function () {
    "use strict";

    var httpExternalRepository = new HttpExternalRepository();
    var awsS3DocumentRepository = new AwsS3DocumentRepository();

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

        var timestamp = new Date().toISOString();

        return httpExternalRepository.retrieveDocument(url)
            .then(function (documentContent) {
                var doc = new Kraken.ImportedDocument();
                doc.ArticleSourceId = validated.articleSource.getId();
                doc.Type = validated.documentType;
                doc.ImportDateTime = timestamp;
                doc.Id = request.DocumentId;
                doc.SourceUrl = url;
                doc.DocumentContent = documentContent;
                doc.Metadata = {
                    "ContentType": "text/html"
                };
                return doc;
            }).then(awsS3DocumentRepository.storeImportedDocument)
            .then(function (/* Kraken.ImportedDocument */ importedDocument) {
                return new Kraken.ImportDocumentResult({
                    Status: Kraken.STATUS_UNKNOWN,
                    ImportedDocument: importedDocument
                });
            });
    };

    ImportDocument.prototype.isAsync = function () {
        return true;
    };

    var handler = module.exports = new ImportDocument().handler;
})();
