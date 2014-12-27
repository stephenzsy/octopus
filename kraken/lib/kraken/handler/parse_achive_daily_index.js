var util = require('util');
var Kraken = require('kraken-model').Types;
var Q = require('q');

var GenericHandler = require('./generic_handler');
var InputValidators = require("./util/input_validators");

(function () {
    "use strict";

    var awsS3DocumentRepository = require('../document_repository/aws_s3_document_repository');

    function ParseArchiveDailyIndex() {
        GenericHandler.call(this);
    }

    util.inherits(ParseArchiveDailyIndex, GenericHandler);

    ParseArchiveDailyIndex.prototype.getMethodName = function () {
        return 'ParseArchiveDailyIndex';
    };

    ParseArchiveDailyIndex.prototype.enact = function (/*Kraken.GenericDocumentRequest*/ request) {
        var validated = InputValidators.validateGenericDocumentRequest(request);
        var archiveDailyIndexParser = validated.articleSource.getArchiveDailyIndexParser();

        return awsS3DocumentRepository.getImportedDocument(request.ArticleSourceId, request.DocumentType, request.DocumentId)
            .then(function (result) {
                if (result) {
                    var documentContent = result.Body.toString();
                    var parsed = archiveDailyIndexParser.parse(documentContent);
                    console.log(parsed);
                    return new Kraken.ArchiveDailyIndex({
                        Status: Kraken.STATUS_READY
                    });
                } else {
                    throw new Kraken.ValidationError({
                        ErrorCode: "InvalidDocument.NotImported",
                        Message: "Document not imported: " + request.toString()
                    });
                }
            });
    };

    ParseArchiveDailyIndex.prototype.isAsync = function () {
        return true;
    };

    var handler = module.exports = new ParseArchiveDailyIndex().handler;
})();
