var util = require('util');
var Kraken = require('kraken-model').Types;
var Q = require('q');

var GenericHandler = require('./generic_handler');
var HttpExternalRepository = require("../document_repository/http_external_repository");
var InputValidators = require("./util/input_validators");

(function () {
    "use strict";

    var httpExternalRepository = new HttpExternalRepository();
    var awsS3DocumentRepository = require('../document_repository/aws_s3_document_repository');

    function ImportDocument() {
        GenericHandler.call(this);
    }

    util.inherits(ImportDocument, GenericHandler);

    ImportDocument.prototype.getMethodName = function () {
        return 'ImportDocument';
    };

    ImportDocument.prototype.enact = function (/*Kraken.GenericDocumentRequest*/ request) {
        var validated = InputValidators.validateGenericDocumentRequest(request);
        var articleSource = validated.articleSource;

        // resolve url
        var metadata = {
            ContentType: "text/html"
        };

        var url = null;
        if (request.DocumentType === Kraken.TYPE_DAILY_INDEX) {
            url = articleSource.getArchiveDailyIndexUrlForId(request.DocumentId);
        } else if (request.DocumentType === Kraken.TYPE_ARTICLE) {
            url = articleSource.getArticleUrlForId(request.DocumentId);
            metadata['ArchiveBucket'] = request.ArchiveBucket;
        }

        var timestamp = new Date().toISOString();

        return httpExternalRepository.retrieveDocument(url)
            .then(function (documentContent) {
                return new Kraken.ImportedDocument({
                    ArticleSourceId: articleSource.getId(),
                    Type: validated.documentType,
                    ImportTimestamp: timestamp,
                    Id: request.DocumentId,
                    SourceUrl: url,
                    DocumentContent: documentContent,
                    Metadata: metadata
                });
            }).then(awsS3DocumentRepository.storeImportedDocument)
            .then(function (/* Kraken.ImportedDocument */ importedDocument) {
                importedDocument.Status = Kraken.STATUS_IMPORTED;
                return importedDocument;
            });
    };

    ImportDocument.prototype.isAsync = true;

    var handler = module.exports = new ImportDocument().handler;
})();
