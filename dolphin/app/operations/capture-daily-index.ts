import http = require('http');
import crypto = require('crypto');

///<reference path="../../scripts/typings/q/Q.d.ts"/>
///<reference path="../../scripts/typings/moment/moment.d.ts"/>
///<reference path="../../scripts/typings/cheerio/cheerio.d.ts"/>
import Q = require('q');
import moment = require('moment');
import cheerio = require('cheerio');

import Operation = require('../../lib/events/operation');
import ArticleSource = require('../models/article-source');
import CapturedDocument = require('../document/import/captured-document');
import CaptureDailyIndexRequest = require('../models/capture-daily-index-request');
import CaptureDailyIndexResult = require('../models/capture-daily-index-result');
import articleSources = require('../config/article-sources');
import AwsDocumentStorage = require('../document/storage/aws-document-storage');
'use strcit';

class CaptureDailyIndex implements Operation<CaptureDailyIndexRequest, CaptureDailyIndexResult> {
    name:string = 'CaptureDailyIndex';
    isAsync:boolean = true;
    private documentStorage:AwsDocumentStorage = new AwsDocumentStorage();

    enact(request:CaptureDailyIndexRequest):CaptureDailyIndexResult {
        throw 'WTF';
    }

    enactAsync(request:CaptureDailyIndexRequest):Q.Promise<CaptureDailyIndexResult> {
        var _this:CaptureDailyIndex = this;
        var articleSource:ArticleSource = request.articleSource;
        var url:string = articleSource.getUrlForIndexId(request.DailyIndexId);
        var deferred:Q.Deferred<string> = Q.defer<string>();
        http.get(url, (res:http.IncomingMessage):void => {
            var content:string = '';
            var completed:boolean = false;
            res.on('data', (chunk:string) => {
                content += chunk;
            });
            res.on('end', () => {
                completed = true;
                deferred.resolve(content);
            });
            res.on('close', () => {
                if (!completed) {
                    deferred.reject({});
                }
            });
            res.on('error', (err:any) => {
                deferred.reject(err);
            });
        });
        return deferred.promise.then((content: string): Q.Promise<CapturedDocument> => {
            content = articleSource.dailyIndexSanitizer.sanitize(cheerio.load(content, {
                normalizeWhitespace: true
            })).html();

            var doc = new CapturedDocument();
            doc.articleSourceId = articleSource.Id;
            doc.sourceUrl = url;
            doc.documentId = request.DailyIndexId;
            doc.archiveBucket = 'daily-index/' + request.DailyIndexId.substr(0, 4) + '/' + request.DailyIndexId.substr(5, 2);
            doc.content = content;
            doc.timestamp = moment().utc().toISOString();

            // store the document
            return _this.documentStorage.storeCapturedDocumentAsync(doc)
                .then((result:any):CapturedDocument => {
                    return doc;
                });
        }).then((doc:CapturedDocument):CaptureDailyIndexResult => {
            var result:CaptureDailyIndexResult = new CaptureDailyIndexResult();
            result.CapturedDocument = doc;
            return result;
        });
    }

    validateInput(input:any):CaptureDailyIndexRequest {
        return CaptureDailyIndexRequest.validate(input);
    }
}

export = CaptureDailyIndex;
