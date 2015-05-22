import Result = require('../../lib/events/result');
import ArticlesIndex = require('../document/index/articles-index');

class GetArticlesIndexStatusResult implements Result<GetArticlesIndexStatusResult> {
    indexIntervals: ArticlesIndex.Interval[];

    toJsonObject(): any {
        return {
            "Intervals": this.indexIntervals.map(function (interval: ArticlesIndex.Interval) {
                return {
                    "Start": interval.start.utc().toISOString(),
                    "End": interval.end.utc().toISOString(),
                    "Status": interval.status
                };
            })
        };
    }
}

export = GetArticlesIndexStatusResult;
