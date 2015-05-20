///<reference path="../../scripts/typings/validator/validator.d.ts"/>
///<reference path="../../scripts/typings/moment/moment.d.ts"/>
import validator = require('validator');
import moment = require('moment-timezone');

import HtmlSanitizer = require('../document/transform/html-sanitizer');
import HtmlParser = require('../document/transform/html-parser');
import CapturedDocument = require('../document/import/captured-document');
import ArticlesIndexDocument = require('../document/index/articles-index-document');

module ArticleSource {
    export interface IndexInfo {
        archiveBucket: string;
        indexId: string;
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
    toArticlesIndexDocumentItems: (obj: any) => ArticlesIndexDocument.Item[];
    dailyIndexSanitizer: HtmlSanitizer = null;
    dailyIndexParser: HtmlParser = null;

    getCoverage(doc: ArticlesIndexDocument): ArticlesIndexDocument.Coverage {
        var status: string = ArticlesIndexDocument.Status.Unknown;
        var start: moment.Moment = moment.tz(doc.documentId, this.defaultTimezone).startOf('day');
        var end: moment.Moment = start.clone().add(1, 'day');
        if (doc.validBeforeTimestamp) {
            status = ArticlesIndexDocument.Status.Partial;
        } else {
            status = ArticlesIndexDocument.Status.Complete;
        }
        return {
            start: start,
            end: end,
            status: status,
            partition: this.Id
        }
    }

    get indexPartition(): string {
        return this.Id + ':daily';
    }

    getIndexInfoForTimestamp(docTime: moment.Moment): ArticleSource.IndexInfo {
        var tzTime: moment.Moment = docTime.tz(this.defaultTimezone);
        var r: ArticleSource.IndexInfo = {
            archiveBucket: tzTime.format('YYYY/MM'),
            indexId: tzTime.format('YYYY-MM-DD'),
        };
        return r;
    }

    validateDocument(doc: CapturedDocument) {
        var cutoff: moment.Moment = moment.tz(doc.documentId, this.defaultTimezone).endOf('day').add(1, 'hour');
        var captureTime: moment.Moment = moment(doc.timestamp);
        if (!captureTime.isAfter(cutoff)) {
            doc.validBeforeTimestamp = captureTime.clone().add(10, 'minute').utc().toISOString();
        }
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