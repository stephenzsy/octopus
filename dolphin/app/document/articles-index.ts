import moment = require('moment');
import Q = require('q');

import ArticleSource = require('../models/article-source');

module ArticlesIndex {
    export interface Interval {
        start: moment.Moment;
        end: moment.Moment;
        status: string;
    }
}

interface ArticlesIndex {
    fetchIntervalsAsync(articleSource: ArticleSource,
        offset: moment.Moment /*offset inclusive*/, forward: boolean, durationSeconds: number): Q.Promise<ArticlesIndex.Interval[]>;
}

export = ArticlesIndex;
