var util = require("util");
var crypto = require('crypto');

var Config = require('../../../config');
var Q = require('q');
var AWS = require('aws-sdk');
var Kraken = require('kraken-model').Types;
var AWSS3DocumentRepository = require('./aws_s3_document_repository').class;

(function () {
    "use strict";

    function AwsS3DynamodbDocumentRepository() {
        AWSS3DocumentRepository.call(this);
    }

    util.inherits(AwsS3DynamodbDocumentRepository, AWSS3DocumentRepository);

    var credentials = null;
    if (Config.aws.credentials && Config.aws.credentials.profile) {
        credentials = new AWS.SharedIniFileCredentials({profile: Config.aws.credentials.profile});
    } else {
        credentials = new AWS.EC2MetadataCredentials();
    }
    AWS.config.credentials = credentials;

    var s3 = new AWS.S3({region:  Config.aws.s3.region});
    var dynamodb = new AWS.DynamoDB({region: Config.aws.dynamodb.region});
    var bucketName = Config.aws.s3.bucket;
    var tableName = Config.aws.dynamodb.tableName;

    function getDynamodbArticleKey(articleSourceId, archiveBucket, documentId) {
        return articleSourceId + ":" + archiveBucket + ":" + documentId;
    }

    AwsS3DynamodbDocumentRepository.prototype.storeImportedDocument = function (/* Kraken.ImportedDocument */ importedDocument) {
        var deferredS3 = Q.defer();
        var deferredDynamodb = Q.defer();
        var s3Key = AwsS3DynamodbDocumentRepository.prototype.getS3KeyForImportedDocument(importedDocument, 'raw');

        var putItemRequest = {
            TableName: tableName,
            Item: {
                ArticleKey: {S: getDynamodbArticleKey(importedDocument.ArticleSourceId, importedDocument.Metadata['ArchiveBucket'], importedDocument.Id)},
                ImportTimestamp: {S: importedDocument.ImportTimestamp},
                ArticleSourceId: {S: importedDocument.ArticleSourceId},
                ArchiveBucket: {S: importedDocument.Metadata['ArchiveBucket']},
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
