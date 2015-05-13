///<reference path="../../../scripts/typings/aws-sdk/aws-sdk.d.ts"/>
///<reference path="../../../scripts/typings/validator/validator.d.ts"/>

import AWS = require('aws-sdk');
import validator = require('validator');

import DocumentStorage = require('./document-storage');
import CapturedDocument = require('../../models/captured-document');
import ConfigurationManager = require('../../config/configuration-manager');
import InternalException = require('../../../lib/events/internal-exception');

'use strict';

/**
 * Document storage using both AWS S3, and DynamoDB
 */
class AwsDocumentStorage implements DocumentStorage {

    static get engineVersion():string {
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
        this.bucket = ConfigurationManager.DocumentS3Bucket();
    }

    storeCapturedDocumentAsync(doc: CapturedDocument) {
        if (!doc.validateFields()) {
            throw new InternalException('InvalidCapturedDocument', 'Validation faild for captured document');
        }
        var documentKey = doc.ArticleSourceId + "/" + doc.ArchiveBucket + "/" + doc.DocumentId;
        // formulate s3 key
        this.s3.putObject({
            Bucket:
        }, (err: any, data: any): void => {
            console.error(err);
            console.log(data);
        })
    }

}

export = AwsDocumentStorage;
