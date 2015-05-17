import moment = require('moment');
import Q = require('q');

import IndexInterval = require('./articles-index-interval');
import ArticleSource = require('../models/article-source');

interface ArticlesIndex {
    fetchIntervalsAsync(articleSource: ArticleSource,
        offset: moment.Moment /*offset inclusive*/, forward: boolean, durationSeconds: number): Q.Promise<IndexInterval[]>;
}

export = ArticlesIndex;
