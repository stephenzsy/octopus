///<reference path="../../scripts/typings/validator/validator.d.ts"/>
///<reference path="../../scripts/typings/moment/moment.d.ts"/>
import validator = require('validator');
import moment = require('moment-timezone');

import HtmlSanitizer = require('../document/transform/html-sanitizer');

class ArticleSource {
    Id:string;
    Name:string;
    Url:string;

    defaultTimezone:string;

    toJsonObject():any {
        return {
            "Id": this.Id,
            "Name": this.Name,
            "Url": this.Url
        }
    }

    getDailyIndexUrl: (dateString: string) => string;
    dailyIndexSanitizer: HtmlSanitizer = null;

    isValidDailyIndexId(dailyIndexId:string):boolean {
        if (!validator.isDate(dailyIndexId)) {
            return false;
        }
        var parsedDate:moment.Moment = moment.tz(dailyIndexId, this.defaultTimezone);
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