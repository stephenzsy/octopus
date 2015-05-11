import Operation = require('../../lib/events/operation');
import DailyIndexMetadata = require('../models/daily-index-metadata');
import ListDailyIndicesRequest = require('../models/list-daily-indices-request');
import ListDailyIndicesResult = require('../models/list-daily-indices-result');
import ArticleSource = require('../models/article-source');
class ListArticleSources implements Operation<ListDailyIndicesRequest, ListDailyIndicesResult> {
    name:string = 'ListDailyIndices';

    enact(request:ListDailyIndicesRequest):ListDailyIndicesResult {
        var articleSource:ArticleSource = request.articleSource;

        var result:ListDailyIndicesResult = new ListDailyIndicesResult();
        return result;
    }

    // do not validate simply return empty request
    validateInput(input:any):ListDailyIndicesRequest {
        return ListDailyIndicesRequest.validate(input);
    }
}

export = ListArticleSources
