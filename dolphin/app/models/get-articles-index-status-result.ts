import Result = require('../../lib/events/result');
import IndexInterval = require('../document/articles-index-interval');


class GetArticlesIndexStatusResult implements Result<GetArticlesIndexStatusResult> {
    indexIntervals: IndexInterval[];

    toJsonObject(): any {
        return {
            "Intervals": this.indexIntervals.map(function (interval: IndexInterval) {
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
