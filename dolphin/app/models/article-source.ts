///<reference path="../../scripts/typings/validator/validator.d.ts"/>
///<reference path="../../scripts/typings/moment/moment.d.ts"/>
import validator = require('validator');
import moment = require('moment-timezone');

import HtmlSanitizer = require('../document/transform/html-sanitizer');
import HtmlParser = require('../document/transform/html-parser');
import CapturedDocument = require('../document/import/captured-document');

module ArticleSource {
    export interface IndexInfo {
        archiveBucket: string;
        indexId: string;
        validBefore?: moment.Moment;
        validAfter?: moment.Moment;
    }
}

class ArticleSource {
    static IndexType = {
        DailyIndex: 'DailyIndex'
    };

    Id: string;
    Name: string;
    Url: string;
    version: string;
    indexType: string;

    defaultTimezone: string;

    toJsonObject(): any {
        return {
            "Id": this.Id,
            "Name": this.Name,
            "Url": this.Url
        }
    }

    getUrlForIndexId: (dateString: string) => string;
    dailyIndexSanitizer: HtmlSanitizer = null;
    dailyIndexParser: HtmlParser = null;

    getIndexInfoForTimestamp(timestamp: moment.Moment): ArticleSource.IndexInfo {
        var tzTime: moment.Moment = timestamp.tz(this.defaultTimezone);
        var r: ArticleSource.IndexInfo = {
            archiveBucket: tzTime.format('YYYY/MM'),
            indexId: tzTime.format('YYYY-MM-DD'),
        };
        var validAfter: moment.Moment = tzTime.clone().endOf('day').add(15, 'minute');
        var validBefore: moment.Moment = timestamp.clone().add(10, 'minute');
        var now: moment.Moment = moment();
        if (!now.isAfter(validAfter)) {
            r.validAfter = validAfter;
            r.validBefore = validBefore;
        }
        return r;
    }

    isValidDailyIndexId(dailyIndexId: string): boolean {
        if (!validator.isDate(dailyIndexId)) {
            return false;
        }
        var parsedDate: moment.Moment = moment.tz(dailyIndexId, this.defaultTimezone);
        if (parsedDate.isBefore(moment.tz('2010-01-01', this.defaultTimezone))) {
            return false;
        }
        if (parsedDate.isAfter()) {
            return false;
        }
        if (dailyIndexId != parsedDate.format('YYYY-MM-DD')) {
            return false;
        }
        return true;
    }
}

export = ArticleSource;