import http = require('http');
import crypto = require('crypto');

///<reference path="../scripts/typings/q/Q.d.ts"/>
///<reference path="../scripts/typings/moment/moment.d.ts"/>
import Q = require('q');
import moment = require('moment');

import Operation = require('../../lib/events/operation');
import ArticleSource = require('../models/article-source');
import CapturedDocument = require('../models/captured-document');
import CaptureDailyIndexRequest = require('../models/capture-daily-index-request');
import CaptureDailyIndexResult = require('../models/capture-daily-index-result');
import articleSources = require('../config/article-sources');

'use strcit';

class CaptureDailyIndex implements Operation<CaptureDailyIndexRequest, CaptureDailyIndexResult> {
    name: string = 'CaptureDailyIndex';
    isAsync: boolean = true;

    enact(request: CaptureDailyIndexRequest): CaptureDailyIndexResult {
        throw 'WTF';
    }

    enactAsync(request: CaptureDailyIndexRequest): Q.Promise<CaptureDailyIndexResult> {
        var articleSource: ArticleSource = request.articleSource;
        var url: string = articleSource.getDailyIndexUrl(request.DailyIndexId);
        var deferred: Q.Deferred<string> = Q.defer<string>();
        http.get(url, (res: http.IncomingMessage): void => {
            var content: string = '';
            var completed: boolean = false;
            res.on('data', (chunk: string) => {
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
        return deferred.promise.then((content: string): CaptureDailyIndexResult => {
            var result: CaptureDailyIndexResult = new CaptureDailyIndexResult();
            result.CapturedDocument = new CapturedDocument();
            result.CapturedDocument.ArticleSourceId = articleSource.Id;
            result.CapturedDocument.OriginalUrl = url;
            result.CapturedDocument.DocumentId = request.DailyIndexId;
            var hashsum: crypto.Hash = crypto.createHash('sha256');
            hashsum.update(content);            
            result.CapturedDocument.ContentHash = hashsum.digest('base64');
            result.CapturedDocument.Content = content;
            result.CapturedDocument.CaptureTimestamp = moment().utc().toISOString();
            console.dir(result);
            return result;
        });
    }

    validateInput(input: any): CaptureDailyIndexRequest {
        return CaptureDailyIndexRequest.validate(input);
    }
}

export = CaptureDailyIndex;
