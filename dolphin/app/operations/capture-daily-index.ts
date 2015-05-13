import http = require('http');

///<reference path="../scripts/typings/q/Q.d.ts"/>
import Q = require('q');

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
        var deferred: Q.Deferred<CaptureDailyIndexResult> = Q.defer<CaptureDailyIndexResult>();
        http.get(url, (res: http.IncomingMessage): void => {
            var result: CaptureDailyIndexResult = new CaptureDailyIndexResult();
            result.CapturedDocument = new CapturedDocument();
            deferred.resolve(result);
        });
        return deferred.promise;
    }

    validateInput(input: any): CaptureDailyIndexRequest {
        return CaptureDailyIndexRequest.validate(input);
    }
}

export = CaptureDailyIndex;
