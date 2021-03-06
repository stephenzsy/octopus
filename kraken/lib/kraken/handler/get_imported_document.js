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

    GetImportedDocument.prototype.getImportedDocument = function (/*Kraken.GenericDocumentRequest*/ request) {
        return awsS3DocumentRepository.getImportedDocument(request)
            .then(function (result) {
                if (result == null) {
                    throw new Kraken.ValidationError({
                        ErrorCode: Kraken.ERROR_CODE_INVALID_DOCUMENT_ID_NOT_IMPORTED,
                        Message: "Document not imported: " + request.ArticleSourceId + "," + request.DocumentType + "," + request.DocumentId
                    });
                }
                var metadata = {};
                return new Kraken.ImportedDocument({
                    ArticleSourceId: request.ArticleSourceId,
                    Type: request.DocumentType,
                    Id: request.DocumentId,
                    SourceUrl: result.Metadata['source-url'],
                    ImportTimestamp: result.Metadata['import-timestamp'],
                    Metadata: metadata,
                    DocumentContent: result.Body.toString(),
                    Status: Kraken.STATUS_IMPORTED
                });
            });
    };

    GetImportedDocument.prototype.enact = function (/*Kraken.GenericDocumentRequest*/ request) {
        var validated = InputValidators.validateGenericDocumentRequest(request);

        return this.getImportedDocument(request);
    };

    GetImportedDocument.prototype.isAsync = true;

    var handler = module.exports = new GetImportedDocument();
})();
