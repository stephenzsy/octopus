///<reference path="../../scripts/typings/q/Q.d.ts"/>
///<reference path="../../scripts/typings/moment/moment.d.ts"/>
///<reference path="../../scripts/typings/cheerio/cheerio.d.ts"/>
import Q = require('q');
import moment = require('moment');
import cheerio = require('cheerio');

import Operation = require('../../lib/events/operation');
import ArticleSource = require('../models/article-source');
import CapturedDocument = require('../models/captured-document');
import CaptureDailyIndexRequest = require('../models/capture-daily-index-request');
import CaptureDailyIndexResult = require('../models/capture-daily-index-result');
import articleSources = require('../config/article-sources');
import AwsDocumentStorage = require('../document/storage/aws-document-storage');

class ListArticles implements Operation<any, any> {
}

export = ListArticles;
