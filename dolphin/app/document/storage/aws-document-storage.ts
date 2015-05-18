///<reference path="../../../scripts/typings/aws-sdk/aws-sdk.d.ts"/>
///<reference path="../../../scripts/typings/validator/validator.d.ts"/>
///<reference path="../../../scripts/typings/q/Q.d.ts"/>
import AWS = require('aws-sdk');
import validator = require('validator');
import Q = require('q');
import stream = require('stream');
import utils = require('../utils');

import DocumentStorage = require('./document-storage');
import CapturedDocument = require('../import/captured-document');
import ConfigurationManager = require('../../config/configuration-manager');
import InternalException = require('../../../lib/events/internal-exception');

'use strict';

/**
 * Document storage using both AWS S3, and DynamoDB
 */
class AwsDocumentStorage implements DocumentStorage {

    static get engineVersion(): string {
        return '2015-05-13';
    }

    private s3: AWS.S3;
    private bucket: string;

    constructor() {
        this.s3 = new AWS.S3({
            credentials: ConfigurationManager.getAwsCredentialsProvider(),
            signatureVersion: 'v4',
            region: ConfigurationManager.defaultAwsRegion
        });
        this.bucket = ConfigurationManager.documentS3Bucket;
    }

    storeCapturedDocumentAsync(doc: CapturedDocument): Q.Promise<any> {
        var _cthis: AwsDocumentStorage = this;
        if (!doc.validateFields()) {
            throw new InternalException('InvalidCapturedDocument', 'Validation faild for captured document');
        }
        // formulate s3 key
        var documentKey = doc.articleSourceId + "/" + doc.archiveBucket + "/" + doc.documentId;
        var deferred: Q.Deferred<AWS.S3.PutObjectResult> = Q.defer<AWS.S3.PutObjectResult>();
        var metadata: { [s: string]: string; } = doc.metadata || {};
        metadata["capture-timestamp"] = doc.timestamp;
        metadata["source-url"] = doc.sourceUrl;
        this.s3.putObject({
            Bucket: this.bucket,
            Key: documentKey,
            ContentType: 'text/html',
            Body: doc.content,
            Metadata: metadata
        }, (err: any, data: AWS.S3.PutObjectResult): void => {
                if (err) {
                    deferred.reject(err);
                    return;
                }
                deferred.resolve(data);
                //console.log(_cthis.s3.getSignedUrl('getObject', { Bucket: this.bucket, Key: documentKey }));
            });
        return deferred.promise;
    }

    getCapturedDocumentAsync(articleSourceId: string, archiveBucket: string, documentId: string): Q.Promise<CapturedDocument> {
        var s3Key = articleSourceId + '/' + archiveBucket + '/' + documentId;
        var deferred: Q.Deferred<AWS.S3.GetObjectResult> = Q.defer<AWS.S3.GetObjectResult>();
        this.s3.getObject({
            Bucket: this.bucket,
            Key: s3Key
        }, function (err: AWS.Error, data: AWS.S3.GetObjectResult): void {
                if (err) {
                    if (err.code === 'NoSuchKey') {
                        deferred.resolve(null);
                    } else {
                        deferred.reject(err);
                    }
                    return;
                }
                deferred.resolve(data);
            });
        return deferred.promise.then(function (res: AWS.S3.GetObjectResult): CapturedDocument {
            if (res == null) {
                return null;
            }
            var doc: CapturedDocument = new CapturedDocument;
            doc.articleSourceId = articleSourceId;
            doc.archiveBucket = archiveBucket;
            doc.documentId = documentId;
            doc.metadata = res.Metadata;
            doc.timestamp = res.Metadata["capture-timestamp"];
            doc.sourceUrl = res.Metadata["source-url"];
            doc.content = res.Body.toString();
            return doc;
        });
    }

}

export = AwsDocumentStorage;
