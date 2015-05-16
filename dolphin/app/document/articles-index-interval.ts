import moment = require('moment');

interface ArticleIndexInterval {
    start: moment.Moment;
    end: moment.Moment;
    status: string;
}

export = ArticleIndexInterval;
