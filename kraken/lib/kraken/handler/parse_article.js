var util = require('util');
var Kraken = require('kraken-model').Types;
var Q = require('q');

var GenericHandler = require('./generic_handler');
var InputValidators = require("./util/input_validators");

(function () {
    "use strict";

    var awsS3DocumentRepository = require('../document_repository/aws_s3_document_repository');

    function ParseArticle() {
        GenericHandler.call(this);
    }

    util.inherits(ParseArticle, GenericHandler);

    ParseArticle.prototype.getMethodName = function () {
        return 'ParseArchiveDailyIndex';
    };

    ParseArticle.prototype.enact = function (/*Kraken.GenericDocumentRequest*/ request) {
        var validated = InputValidators.validateGenericDocumentRequest(request);
        var articleSource = validated.articleSource;
        var articleParser = articleSource.getArticleParser();

        return this.GetImportedDocumentHandler.getImportedDocument(request)
            .then(function (/*Kraken.ImportedDocument*/ importedDocument) {
                var parseTimestamp = new Date().toISOString();
                var parsed = articleParser.parse(importedDocument.DocumentContent);

                // store it in s3
                return awsS3DocumentRepository.storeParsedDocument(request, parsed, {
                    ImportTimestamp: importedDocument.ImportTimestamp,
                    SourceUrl: importedDocument.SourceUrl,
                    ParseTimestamp: parseTimestamp,
                    ParserModelVersion: articleParser.getModelVersion()
                }).then(function () {
                    return new Kraken.Article({
                        ArticleSourceId: request.ArticleSourceId,
                        ArchiveBucket: request.ArchiveBucket,
                        ArchiveDailyIndexId: request.DocumentId,
                        SourceUrl: importedDocument.SourceUrl,
                        Metadata: {'ParseTimestamp': parseTimestamp},
                        Status: Kraken.STATUS_READY,
                        Content: parsed
                    });
                });
            });
    };

    ParseArticle.prototype.isAsync = true;

    ParseArticle.prototype.setGetImportedDocumentHandler = function (/*GetImportedDocument*/ handler) {
        this.GetImportedDocumentHandler = handler;
    };

    var handler = module.exports = new ParseArticle();
})();
