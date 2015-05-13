import Operation = require('../../lib/events/operation');
import ArticleSource = require('../models/article-source');
import CaptureDailyIndexRequest = require('../models/capture-daily-index-request');
import CaptureDailyIndexResult = require('../models/capture-daily-index-result');
import articleSources = require('../config/article-sources');

'use strcit';

class CaptureDailyIndex implements Operation<CaptureDailyIndexRequest, CaptureDailyIndexResult> {
    name:string = 'CaptureDailyIndex';

    enact(request:CaptureDailyIndexRequest):CaptureDailyIndexResult {
        var result:CaptureDailyIndexResult = new CaptureDailyIndexResult();
        return result;
    }


    // do not validate simply return empty request
    validateInput(input:any):CaptureDailyIndexRequest {
        return CaptureDailyIndexRequest.validate(input);
    }
}

export = CaptureDailyIndex;
