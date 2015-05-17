///<reference path="../../scripts/typings/q/Q.d.ts"/>
///<reference path="../../scripts/typings/moment/moment.d.ts"/>
///<reference path="../../scripts/typings/cheerio/cheerio.d.ts"/>
import Q = require('q');
import moment = require('moment');
import cheerio = require('cheerio');

import Operation = require('../../lib/events/operation');
import ArticleSource = require('../models/article-source');
import CapturedDocument = require('../models/captured-document');
import ListArticlesRequest = require('../models/generic-articles-request');
import ListArticlesResult = require('../models/list-articles-result');
import articleSources = require('../config/article-sources');
import AwsDocumentStorage = require('../document/storage/aws-document-storage');

class ListArticles implements Operation<ListArticlesRequest, ListArticlesResult> {
    name: string = 'ListArticles';

    enact(req: ListArticlesRequest): ListArticlesResult {
        return null;
    }

    validateInput(input: any): ListArticlesRequest {
        return ListArticlesRequest.validate(input);
    }
}

export = ListArticles;
