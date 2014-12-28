var util = require('util');
var Kraken = require('kraken-model').Types;
var Q = require('q');

var GenericHandler = require('./generic_handler');
var HttpExternalRepository = require("../document_repository/http_external_repository");
var InputValidators = require("./util/input_validators");

(function () {
    "use strict";

    var awsS3DocumentRepository = require('../document_repository/aws_s3_document_repository');

    function GetImportedDocument() {
        GenericHandler.call(this);
    }

    util.inherits(GetImportedDocument, GenericHandler);

    GetImportedDocument.prototype.getMethodName = function () {
        return 'GetImportedDocument';
    };

    GetImportedDocument.prototype.getImportedDocument = function (articleSourceId, documentType, documentId) {
        return awsS3DocumentRepository.getImportedDocument(articleSourceId, documentType, documentId)
            .then(function (result) {
                if (result == null) {
                    throw new Kraken.ValidationError({
                        ErrorCode: "InvalidDocument.NotImported",
                        Message: "Document not imported: " + request.toString()
                    });
                }
                var metadata = {};
                return new Kraken.ImportedDocument({
                    ArticleSourceId: articleSourceId,
                    Type: documentType,
                    Id: documentId,
                    SourceUrl: result.Metadata['source-url'],
                    ImportDateTime: result.Metadata['import-date-time'],
                    Metadata: metadata,
                    DocumentContent: result.Body.toString(),
                    Status: Kraken.STATUS_IMPORTED
                });
            });
    };

    GetImportedDocument.prototype.enact = function (/*Kraken.GenericDocumentRequest*/ request) {
        var validated = InputValidators.validateGenericDocumentRequest(request);

        return this.getImportedDocument(request.ArticleSourceId, request.DocumentType, request.DocumentId);
    };

    GetImportedDocument.prototype.isAsync = function () {
        return true;
    };

    var handler = module.exports = new GetImportedDocument();
})();
