var util = require("util");
var crypto = require('crypto');

var Config = require('../../../config');
var Q = require('q');
var AWS = require('aws-sdk');
var Kraken = require('kraken-model').Types;

(function () {
    "use strict";

    function AwsS3DynamodbDocumentRepository() {
    }

    var credentials = new AWS.SharedIniFileCredentials({profile: 'kraken'});
    AWS.config.credentials = credentials;
    var s3 = new AWS.S3({region: 'us-west-2'});
    var dynamodb = new AWS.DynamoDB({region: 'us-west-2'});
    var bucketName = Config.aws.s3.bucket;
    var tableName = Config.aws.dynamodb.tableName;

    function getS3KeyForGenericDocumentRequest(/* Kraken.GenericDocumentRequest */ request, format) {
        if (request.DocumentType === Kraken.TYPE_DAILY_INDEX) {
            return request.ArticleSourceId + ":daily_index:" + format + "/" + request.DocumentId.replace(/-/g, "/");
        } else if (request.DocumentType === Kraken.TYPE_ARTICLE) {
            var hash = crypto.createHash('md5');
            hash.update(request.DocumentId);
            var digest = hash.digest('hex');
            var tail = digest.substring(0, 4) + "/" + request.DocumentId;
            return request.ArticleSourceId + ":article:" + format + "/" + tail;
        } else {
            throw "Invalid imported document type: " + request.DocumentType;
        }
    }

    function getS3KeyForImportedDocument(/* Kraken.ImportedDocument */ importedDocument, format) {
        var request = new Kraken.GenericDocumentRequest({
            ArticleSourceId: importedDocument.ArticleSourceId,
            DocumentType: importedDocument.Type,
            DocumentId: importedDocument.Id
        });
        if (importedDocument.Type === Kraken.TYPE_ARTICLE && importedDocument.Metadata['ArchiveBucket']) {
            request.ArchiveBucket = importedDocument.Metadata['ArchiveBucket'];
        }
        return getS3KeyForGenericDocumentRequest(request, format);
    }

    function getDynamodbArticleKey(articleSourceId, documentId) {
        return articleSourceId + ":" + documentId;
    }

    AwsS3DynamodbDocumentRepository.prototype.storeImportedDocument = function (/* Kraken.ImportedDocument */ importedDocument) {
        var deferredS3 = Q.defer();
        var deferredDynamodb = Q.defer();
        var s3Key = getS3KeyForImportedDocument(importedDocument, 'raw');

        var putItemRequest = {
            TableName: tableName,
            Item: {
                ArticleKey: {S: getDynamodbArticleKey(importedDocument.ArticleSourceId, importedDocument.Id)},
                LatestDateArchived: {S: importedDocument.Metadata['ArchiveBucket']},
                ArticleSourceId: {S: importedDocument.ArticleSourceId},
                ArticleId: {S: importedDocument.Id},
                S3Key: {S: s3Key}
            }
        };
        dynamodb.putItem(putItemRequest, function (err, data) {
            if (err) {
                console.error(err);
                deferredDynamodb.reject(err);
            } else {
                deferredDynamodb.resolve(data);
            }
        });

        var putObjectRequest = {
            Bucket: bucketName,
            Key: s3Key,
            Body: importedDocument.DocumentContent
        };

        var metadata = {};
        for (var k in importedDocument.Metadata) {
            if (k === 'ContentType') {
                putItemRequest.ContentType = importedDocument.Metadata[k];
            } else if (k === 'ArchiveBucket') {
                // skip
            } else {
                metadata[k] = importedDocument.Metadata[k];
            }
        }
        metadata['source-url'] = importedDocument.SourceUrl;
        metadata['import-timestamp'] = importedDocument.ImportTimestamp;
        putObjectRequest.Metadata = metadata;

        s3.putObject(putObjectRequest, function (err, data) {
            if (err) {
                console.error(err);
                deferredS3.reject(err);
            } else {
                deferredS3.resolve(importedDocument);
            }
        });

        return Q.all([deferredS3.promise, deferredDynamodb.promise]).then(function () {
            return importedDocument;
        });
    };

    AwsS3DynamodbDocumentRepository.prototype.storeDocumentRedirection = function (/*Kraken.GenericDocumentRequest*/ request, redirectedArticleId) {
        var deferred = Q.defer();
        if (request.DocumentType === Kraken.TYPE_ARTICLE) {
            var request = {
                TableName: tableName,
                Item: {
                    ArticleKey: {S: getDynamodbArticleKey(request.ArticleSourceId, request.DocumentId)},
                    LatestDateArchived: {S: request.ArchiveBucket},
                    ArticleSourceId: {S: request.ArticleSourceId},
                    ArticleId: {S: request.DocumentId},
                    RedirectTo: {S: getDynamodbArticleKey(request.ArticleSourceId, redirectedArticleId)}
                }
            };
            dynamodb.putItem(request, function (err, data) {
                if (err) {
                    console.error(err);
                    deferred.reject(err);
                } else {
                    deferred.resolve(data);
                }
            });
        } else {
            deferred.reject("Invalid Document Type: " + request.DocumentType);
        }
        return deferred.promise;
    };

    AwsS3DynamodbDocumentRepository.prototype.storeParsedDocument = function (genericDocumentRequest, parsed, metadata) {
        var deferred = Q.defer();
        var s3Key = getS3KeyForGenericDocumentRequest(genericDocumentRequest, 'json');
        var request = {
            Bucket: bucketName,
            Key: s3Key,
            Body: JSON.stringify(parsed),
            ContentType: "application/json",
            Metadata: {
                "import-timestamp": metadata.ImportTimestamp,
                "source-url": metadata.SourceUrl,
                "parse-timestamp": metadata.ParseTimestamp,
                "parser-model-version": metadata.ParserModelVersion
            }
        };
        s3.putObject(request, function (err, data) {
            if (err) {
                console.error(err);
                deferred.reject(err);
            } else {
                deferred.resolve(data);
            }
        });
        return deferred.promise;
    };

    AwsS3DynamodbDocumentRepository.prototype.getParsedDocument = function (genericDocumentRequest) {
        var deferred = Q.defer();
        var s3Key = getS3KeyForGenericDocumentRequest(genericDocumentRequest, 'json');
        var request = {
            Bucket: bucketName,
            Key: s3Key
        };
        s3.getObject(request, function (err, data) {
            if (err) {
                if (err.code === 'NoSuchKey') {
                    deferred.resolve(null);
                } else {
                    console.error(err);
                    deferred.reject(err);
                }
            } else {
                deferred.resolve(data);
            }
        });
        return deferred.promise;
    };

    AwsS3DynamodbDocumentRepository.prototype.getImportedDocumentMetadata = function (genericDocumentRequest) {
        var deferred = Q.defer();
        var s3Key = getS3KeyForGenericDocumentRequest(genericDocumentRequest, 'raw');
        var request = {
            Bucket: bucketName,
            Key: s3Key
        };
        s3.headObject(request, function (err, data) {
            if (err) {
                if (err.code === 'NotFound') {
                    deferred.resolve(null);
                } else {
                    console.error(err);
                    deferred.reject(err);
                }
            } else {
                deferred.resolve(data);
            }
        });
        return deferred.promise;
    };

    AwsS3DynamodbDocumentRepository.prototype.getImportedDocument = function (genericDocumentRequest) {
        var deferred = Q.defer();
        var s3Key = getS3KeyForGenericDocumentRequest(genericDocumentRequest, 'raw');
        var request = {
            Bucket: bucketName,
            Key: s3Key
        };
        s3.getObject(request, function (err, data) {
            if (err) {
                if (err.code === 'NoSuchKey') {
                    deferred.resolve(null);
                } else {
                    console.error(err);
                    deferred.reject(err);
                }
            } else {
                deferred.resolve(data);
            }
        });
        return deferred.promise;
    };

    module.exports = new AwsS3DynamodbDocumentRepository();

})();
