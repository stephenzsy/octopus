var util = require('util');
var Kraken = require('kraken-model').Types;
var Q = require('q');

var GenericHandler = require('./generic_handler');
var InputValidators = require("./util/input_validators");

(function () {
    "use strict";

    var awsS3DocumentRepository = require('../document_repository/aws_s3_document_repository');

    function GetArticle() {
        GenericHandler.call(this);
    }

    util.inherits(GetArticle, GenericHandler);

    GetArticle.prototype.getMethodName = function () {
        return 'GetArticle';
    };

    GetArticle.prototype.enact = function (/*Kraken.GenericDocumentRequest*/ request) {
        var validated = InputValidators.validateGenericDocumentRequest(request);
        var articleSource = validated.articleSource;

        return awsS3DocumentRepository.getParsedDocument(request).then(function (s3Response) {
                if (s3Response == null) {
                    throw new Kraken.ValidationError({
                        ErrorCode: Kraken.ERROR_CODE_INVALID_DOCUMENT_ID_NOT_PARSED,
                        Message: "Document not parsed: " + request.ArticleSourceId + "," + request.DocumentType + "," + request.DocumentId + "," + request.ArchiveBucket
                    });
                }
                return new Kraken.Article({
                    ArticleSourceId: request.ArticleSourceId,
                    ArchiveBucket: request.ArchiveBucket,
                    ArticleId: request.DocumentId,
                    SourceUrl: s3Response.Metadata['source-url'],
                    Metadata: {
                        ImportTimestamp: s3Response.Metadata['import-timestamp'],
                        ParseTimestamp: s3Response.Metadata['parse-timestamp']
                    },
                    Content: s3Response.Body.toString()
                });
            }, function (err) {
                throw err;
            }
        );
    };

    GetArticle.prototype.isAsync = true;

    var handler = module.exports = new GetArticle();
})
();
