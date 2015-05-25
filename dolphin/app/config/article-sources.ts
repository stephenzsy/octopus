///<reference path="../../scripts/typings/node/node.d.ts"/>

import Article = require('../document/article');
import ArticleSource = require('../models/article-source');
import HtmlSanitizer = require('../document/transform/html-sanitizer');
import HtmlParser = require('../document/transform/html-parser');
import ArticlesIndexDocument = require('../document/index/articles-index-document');

var articleSources: { [s: string]: ArticleSource; } = {};
(() => {
    {
        var as: ArticleSource = new ArticleSource();
        as.Id = 'businessinsider';
        as.Name = 'Business Insider';
        as.Url = 'http://www.businessinsider.com';
        as.defaultTimezone = 'America/New_York';
        as.getUrlForIndexId = (indexId: string): string => {
            return 'http://www.businessinsider.com/archives?date=' + indexId;
        };
        as.toArticlesIndexDocumentItems = function (obj: string): ArticlesIndexDocument.Item[] {
            return obj['items'].map(function (itemObj: any): ArticlesIndexDocument.Item {
                var link: string = itemObj['link'];
                var m: RegExpMatchArray = link.match(/^\/(.*-(\d+)-(\d+))$/);
                if (m) {
                    return {
                        id: m[1],
                        archiveBucket: m[2] + '/' + m[3],
                        url: as.Url + link,
                        title: itemObj['title']
                    };
                } else {
                    return {
                        id: link.substr(1),
                        archiveBucket: 'default',
                        url: as.Url + itemObj['link'],
                        title: itemObj['title']
                    };
                }
            });
        };
        as.populateArticleData = function (article:Article, data:any):Article {
            article.timestamp = data['date'];
            article.title = data['meta']['title'];
            article.content = data;
            return article;
        };
        as.version = '2015-05-15';
        as.indexType = ArticleSource.IndexType.DailyIndex;
        as.dailyIndexSanitizer = new HtmlSanitizer(require('../vendor/businessinsider/daily-index-sanitizer-config.json'));
        as.dailyIndexParser = new HtmlParser(require('../vendor/businessinsider/daily-index-parser-config.json'));
        as.articleSanitizer = new HtmlSanitizer(require('../vendor/businessinsider/article-sanitizer-config.json'));
        as.articleParser = new HtmlParser(require('../vendor/businessinsider/article-parser-config.json'));
        articleSources[as.Id] = as;
    }
})();

export = articleSources;
