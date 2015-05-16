import moment = require('moment');

import IndexInterval = require('./articles-index-interval');
import ArticleSource = require('../models/article-source');

interface ArticlesIndex {
    fetchIntervalsAsync(articleSource: ArticleSource, offset: moment.Moment /*offset inclusive*/, backwards: boolean, duration: moment.Duration): IndexInterval[];
}

export = ArticlesIndex;
