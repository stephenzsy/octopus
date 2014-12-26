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

    GetImportedDocument.prototype.enact = function (/*Kraken.ImportDocumentRequest*/ request) {
        var validated = InputValidators.validateImportDocumentRequest(request);

        return awsS3DocumentRepository.getImportedDocument(request.ArticleSourceId, request.DocumentType, request.DocumentId)
            .then(function (result) {
                if (result) {
                    return new Kraken.ImportDocumentResult({
                        Status: Kraken.STATUS_IMPORTED,
                        ImportedDocument: new Kraken.ImportedDocument({
                            ArticleSourceId: request.ArticleSourceId,
                            Type: request.DocumentType,
                            Id: request.DocumentId,
                            SourceUrl: result.Metadata['source-url'],
                            ImportDateTime: result.Metadata['import-date-time'],
                            //  6: map<string, string> Metadata,
                            DocumentContent: result.Body.toString()
                        })
                    });
                } else {
                    return new Kraken.ImportDocumentResult({
                        Status: Kraken.STATUS_NOT_FOUND
                    });
                }
            });
    };

    GetImportedDocument.prototype.isAsync = function () {
        return true;
    };

    var handler = module.exports = new GetImportedDocument().handler;
})();
