import Operation = require('../../lib/events/operation');
import DailyIndexMetadata = require('../models/daily-index-metadata');
import ListDailyIndicesRequest = require('../models/list-daily-indices-request');
import ListDailyIndicesResult = require('../models/list-daily-indices-result');

class ListArticleSources implements Operation<ListDailyIndicesRequest, ListDailyIndicesResult> {
    name:string = 'ListDailyIndices';

    enact(request:ListDailyIndicesRequest):ListDailyIndicesResult {
        var result:ListDailyIndicesResult = new ListDailyIndicesResult();
        return result;
    }

    // do not validate simply return empty request
    validateInput(input:any):ListDailyIndicesRequest {
        var request = new ListDailyIndicesRequest();
        return request;
    }
}

export = ListArticleSources
