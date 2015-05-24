///<reference path="../../../scripts/typings/aws-sdk/aws-sdk.d.ts"/>
///<reference path="../../../scripts/typings/validator/validator.d.ts"/>
///<reference path="../../../scripts/typings/q/Q.d.ts"/>
///<reference path="../../../scripts/typings/gcloud/gcloud.d.ts"/>
import AWS = require('aws-sdk');
import validator = require('validator');
import Q = require('q');
import stream = require('stream');
import gcloud = require('gcloud');

import utils = require('../utils');

import ArticleSource = require('../../models/article-source');
import DocumentStorage = require('./document-storage');
import CapturedDocument = require('../import/captured-document');
import ArticlesIndexDocument = require('../index/articles-index-document');
import ConfigurationManager = require('../../config/configuration-manager');
import InternalException = require('../../../lib/events/internal-exception');

import config = require('../../config/configuration-manager');

'use strict';

/**
 * Document storage using both AWS S3, and DynamoDB
 */
class GcloudDocumentStorage implements DocumentStorage {

    static get engineVersion():string {
        return '2015-05-23';
    }

    private bucketName:string;
    private bucket:gcloud.Storage.Bucket;
    private storage:gcloud.Storage;

    constructor() {
        this.storage = gcloud({
            keyFilename: process.env['HOME'] + "/.gcloud/dolphin-creds.json",
            projectId: config.gcloudProjectId
        }).storage();
        this.bucketName = ConfigurationManager.documentGcloudBucket;
        this.bucket = this.storage.bucket(this.bucketName);
    }

    private static getFilename(doc:CapturedDocument):string {
        return doc.articleSourceId + '/' + doc.documentType + "/" + doc.archiveBucket + "/" + doc.documentId;
    }

    storeCapturedDocumentAsync(doc:CapturedDocument):Q.Promise<any> {
        var _cthis:GcloudDocumentStorage = this;
        if (!doc.validateFields()) {
            throw new InternalException('InvalidCapturedDocument', 'Validation faild for captured document');
        }
        var file:gcloud.Storage.File = this.bucket.file(GcloudDocumentStorage.getFilename(doc));
        var deferred:Q.Deferred<any> = Q.defer<any>();
        var contentType:string = 'text/plain';
        switch(doc.documentType) {
            case CapturedDocument.DocumentType.IndexRaw:
                contentType = 'text/html';
                break;
            case CapturedDocument.DocumentType.IndexJson:
                contentType = 'application/json';
                break;
        }
        var s:NodeJS.WritableStream = file.createWriteStream({
            metadata: {
                contentType: contentType,
                metadata: doc.metadata
            }
        });
        s.end(doc.content, 'utf8', function () {
            deferred.resolve({});
        });
        return deferred.promise;
    }


    private getStorageFile(key:string):Q.Promise<{
        metadata: {[s:string]:string};
        content: string;
    }> {
        var file:gcloud.Storage.File = this.bucket.file(key);
        var metadataPromise:Q.Promise<gcloud.Storage.FileMetadata> = <Q.Promise<gcloud.Storage.FileMetadata>> Q.ninvoke(file, 'getMetadata');
        var stream:NodeJS.ReadableStream = file.createReadStream();
        var data:string = '';
        stream.on('data', function (chunk:any) {
            data += chunk.toString();
        });
        var deferred:Q.Deferred<string> = Q.defer<string>();
        stream.on('end', function (chunk:any) {
            deferred.resolve(data);
        });
        stream.on('error', function (err) {
            deferred.reject(err);
        });
        return Q.all([<Q.Promise<any>>metadataPromise, <Q.Promise<any>>deferred.promise]).then(function (values:any[]) {
            return {
                metadata: <{[s:string]:string}>values[0].metadata,
                content: <string> values[1]
            };
        }, function (err:any) {
            if (err.code == 404) {
                // not found
                return null;
            }
            throw err;
        });
    }


    getCapturedDocumentAsync(articleSourceId:string, documentType:string, archiveBucket:string, documentId:string):Q.Promise<CapturedDocument> {
        return this.getStorageFile(articleSourceId + '/' + documentType + '/' + archiveBucket + '/' + documentId).then(function (f:{
            metadata: {[s:string]:string};
            content: string;
        }) {
            if (f == null) {
                return null;
            }
            var doc:CapturedDocument = new CapturedDocument();
            doc.articleSourceId = articleSourceId;
            doc.archiveBucket = archiveBucket;
            doc.documentType = documentType;
            doc.documentId = documentId;
            doc.metadata = f.metadata;
            doc.content = f.content;
            return doc;
        });
    }


    getArticlesIndexAsync(articleSource:ArticleSource, archiveBucket:string, indexId:string):Q.Promise<ArticlesIndexDocument> {
        return this.getStorageFile(articleSource.Id + '/' + CapturedDocument.DocumentType.IndexJson + '/' + archiveBucket + '/' + indexId).then(function (f:{
            metadata: {[s:string]:string};
            content: string;
        }) {
            if (f == null) {
                return null;
            }

            var doc:ArticlesIndexDocument = new ArticlesIndexDocument(articleSource);
            doc.archiveBucket = archiveBucket;
            doc.documentId = indexId;
            doc.metadata = f.metadata;
            doc.content = f.content;
            return doc;
        });
    }

}

export = GcloudDocumentStorage;
