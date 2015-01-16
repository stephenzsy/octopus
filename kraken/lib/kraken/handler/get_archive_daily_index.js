var util = require('util');
var moment = require('moment-timezone');

var Kraken = require('kraken-model').Types;
var InputValidators = require('./util/input_validators');

var GenericHandler = require('./generic_handler');

(function () {
    "use strict";

    var awsS3DocumentRepository = require('../document_repository/aws_s3_document_repository');

    function GetArchiveDailyIndex() {
        GenericHandler.call(this);
    }

    util.inherits(GetArchiveDailyIndex, GenericHandler);

    GetArchiveDailyIndex.prototype.getMethodName = function () {
        return 'GetArchiveDailyIndex';
    };

    GetArchiveDailyIndex.prototype.enact = function (/*Kraken.GenericDocumentRequest*/ request) {
        var validated = InputValidators.validateGenericDocumentRequest(request);
        var articleSource = validated.articleSource;

        return awsS3DocumentRepository.getParsedDocument(request)
            .then(function (s3Response) {
                if (!s3Response) {
                    throw new Kraken.ValidationError({
                        ErrorCode: Kraken.ERROR_CODE_INVALID_DOCUMENT_ID_NOT_PARSED,
                        Message: "Document is not parsed: " + request.toString()
                    });
                }

                if (moment(s3Response.Metadata['import-timestamp']) <
                    articleSource.getLocalDateForArchiveDailyIndexId(request.DocumentId).startOf('day').add(1, 'd').add(1, 'h')) {
                    throw new Kraken.DocumentExpiredError({
                        ErrorCode: Kraken.ERROR_CODE_DOCUMENT_EXPIRED,
                        Message: "Document expired: Originally imported at " + s3Response.Metadata['import-timestamp']
                    });
                }

                var parsed = JSON.parse(s3Response.Body.toString());
                var entries = articleSource.toListOfArchiveDailyIndexEntries(parsed);
                return new Kraken.ArchiveDailyIndex({
                    Status: Kraken.STATUS_READY,
                    ArticleSourceId: request.ArticleSourceId,
                    ArchiveDailyIndexId: request.DocumentId,
                    LocalDate: articleSource.getLocalDateForArchiveDailyIndexId(request.DocumentId).format(),
                    SourceUrl: s3Response.Metadata['source-url'],
                    Metadata: {
                        "ImportTimestamp": s3Response.Metadata['import-timestamp'],
                        "ParseTimestamp": s3Response.Metadata['parse-timestamp']
                    },
                    ArticleEntries: entries
                });
            });
    };

    GetArchiveDailyIndex.prototype.isAsync = true;

    var handler = module.exports = new GetArchiveDailyIndex().handler;
})();
