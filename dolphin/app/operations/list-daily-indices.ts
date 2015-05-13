///<reference path="../../scripts/typings/moment/moment.d.ts"/>

import Operation = require('../../lib/events/operation');
import DailyIndexMetadata = require('../models/daily-index-metadata');
import ListDailyIndicesRequest = require('../models/list-daily-indices-request');
import ListDailyIndicesResult = require('../models/list-daily-indices-result');
import ArticleSource = require('../models/article-source');
import moment = require('moment-timezone');

class ListArticleSources implements Operation<ListDailyIndicesRequest, ListDailyIndicesResult> {
    name:string = 'ListDailyIndices';

    enact(request:ListDailyIndicesRequest):ListDailyIndicesResult {
        var articleSource:ArticleSource = request.articleSource;

        var ts:moment.Moment = moment().startOf('day').tz(articleSource.defaultTimezone);
        var metadataList:DailyIndexMetadata[] = [];
        for (var i:number = 0; i < 10; ++i) {
            var localDate = ts.format('YYYY-MM-DD');

            var metadata:DailyIndexMetadata = new DailyIndexMetadata();
            metadata.Id = localDate;
            metadata.ArticleSourceId = articleSource.Id;
            metadata.LocalDate = ts.toISOString();
            metadata.Timezone = articleSource.defaultTimezone;
            metadata.Url = articleSource.getDailyIndexUrl(localDate);

            metadataList.push(metadata);
            ts.subtract(1, 'day');
        }

        var result:ListDailyIndicesResult = new ListDailyIndicesResult();
        result.DailyIndicesMetadata = metadataList;
        return result;
    }

    validateInput(input:any):ListDailyIndicesRequest {
        return ListDailyIndicesRequest.validate(input);
    }
}

export = ListArticleSources
