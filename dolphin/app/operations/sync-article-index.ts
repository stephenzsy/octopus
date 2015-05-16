///<reference path="../../scripts/typings/q/Q.d.ts"/>
///<reference path="../../scripts/typings/moment/moment.d.ts"/>
///<reference path="../../scripts/typings/cheerio/cheerio.d.ts"/>
import Q = require('q');
import moment = require('moment');
import cheerio = require('cheerio');

import Operation = require('../../lib/events/operation');
import ArticleSource = require('../models/article-source');
import CapturedDocument = require('../models/captured-document');
import SyncArticleIndexRequest = require('../models/sync-article-index-request');
import SyncArticleIndexResult = require('../models/sync-article-index-result');
import articleSources = require('../config/article-sources');
import AwsDocumentStorage = require('../document/storage/aws-document-storage');

class SyncArticleIndex implements Operation<SyncArticleIndexRequest, SyncArticleIndexResult> {
    name: string = 'SyncArticleIndex';

    enact(req: SyncArticleIndexRequest): SyncArticleIndexResult {
        return null;
    }

    validateInput(input: any): SyncArticleIndexRequest {
        return SyncArticleIndexRequest.validate(input);
    }
}

export = SyncArticleIndex;
