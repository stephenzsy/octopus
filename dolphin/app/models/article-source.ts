///<reference path="../../scripts/typings/validator/validator.d.ts"/>
///<reference path="../../scripts/typings/moment/moment.d.ts"/>
import validator = require('validator');
import moment = require('moment-timezone');

import HtmlSanitizer = require('../document/transform/html-sanitizer');
import CapturedDocument = require('../document/import/captured-document');

module ArticleSource {
    export interface IndexInfo {
        archiveBucket: string; indexId: string;
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

    getIndexInfoForTimestamp(timestamp: moment.Moment): ArticleSource.IndexInfo {
        var tzTime:moment.Moment = timestamp.tz(this.defaultTimezone);
        return {
            archiveBucket: tzTime.format('YYYY/MM/DD'),
            indexId: tzTime.format('YYYY-MM-DD')
        }
    }

    isCapturedDocumentUpToDate(doc: CapturedDocument): boolean {
        var cutoff: moment.Moment = moment().tz(this.defaultTimezone).endOf('day').add(15, 'minute');
        return moment(doc.timestamp).isAfter(cutoff);
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