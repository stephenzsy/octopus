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
        var articleSource = validated.articleSource;

        return this.GetImportedDocumentHandler.getImportedDocument(request.ArticleSourceId, request.DocumentType, request.DocumentId)
            .then(function (/*Kraken.ImportedDocument*/ importedDocument) {
                var parsed = archiveDailyIndexParser.parse(importedDocument.DocumentContent);
                console.log(parsed);
                console.log(importedDocument);

                //                struct ArchiveDailyIndex {
                //  1: string ArticleSourceId,
                //        2: string ArchiveDailyIndexId,
                //        3: string LocalDate,
                //        4: string Status,
                //        5: string SourceUrl,
                //        6: map<string, string> Metadata,
                //        7: string Content


                // then store

                return new Kraken.ArchiveDailyIndex({
                    Status: Kraken.STATUS_READY
                });
            });
    };

    ParseArchiveDailyIndex.prototype.isAsync = function () {
        return true;
    };

    ParseArchiveDailyIndex.prototype.setGetImportedDocumentHandler = function (/*GetImportedDocument*/ handler) {
        this.GetImportedDocumentHandler = handler;
    };

    var handler = module.exports = new ParseArchiveDailyIndex();
})();
