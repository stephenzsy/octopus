import express = require('express');

import Event = require('../lib/events/event');
import EventHandlerChain = require('../lib/events/event-handler-chain');
import JsonProtocolHandler = require('../lib/events/json-protocol-handler');
import OperationsHandler = require('../lib/events/operations-handler');

import DatastoreArticlesIndex = require('./document/index/gcloud-datastore-articles-index');
import GcloudDocumentStorage = require('./document/storage/gcloud-document-storage');
import ArticlesIndexImporter = require('./document/import/articles-index-importer');

import ListArticleSources = require('./operations/list-article-sources');
import ListDailyIndices = require('./operations/list-daily-indices');
import GetArticlesIndexStatus = require('./operations/get-articles-index-status');
import ImportArticlesIndex = require('./operations/import-articles-index');
import SyncArticlesIndex = require('./operations/sync-articles-index');
import ListArticles = require('./operations/list-articles');

export module Dolphin.Events {
    export class Orchestrator {
        private handlerChain: EventHandlerChain;

        constructor() {
            var operationsHandler: OperationsHandler = new OperationsHandler();

            var articlesIndex: DatastoreArticlesIndex = new DatastoreArticlesIndex();
            var documentStorage: GcloudDocumentStorage = new GcloudDocumentStorage();
            var indexImporter: ArticlesIndexImporter = new ArticlesIndexImporter(documentStorage);

            operationsHandler.registerOperation(new ListArticleSources());
            operationsHandler.registerOperation(new ListDailyIndices());
            operationsHandler.registerOperation(new ListArticles(articlesIndex));
            operationsHandler.registerOperation(new GetArticlesIndexStatus(articlesIndex));
            operationsHandler.registerOperation(new ImportArticlesIndex(articlesIndex, indexImporter));
            operationsHandler.registerOperation(new SyncArticlesIndex(articlesIndex, indexImporter));

            this.handlerChain = new EventHandlerChain([
                new JsonProtocolHandler(),
                operationsHandler
            ]);
        }

        orchestrate(req: express.Request, res: express.Response) {
            var event: Event = new Event();
            event.originalRequest = req;
            event.originalResponse = res;
            this.handlerChain.orchestrate(event);
        }
    }
}