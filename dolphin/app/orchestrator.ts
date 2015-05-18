import express = require('express');

import Event = require('../lib/events/event');
import EventHandlerChain = require('../lib/events/event-handler-chain');
import JsonProtocolHandler = require('../lib/events/json-protocol-handler');
import OperationsHandler = require('../lib/events/operations-handler');

import DynamodbArticlesIndex = require('./document/aws-dynamodb-articles-index');
import AwsDocumentStorage = require('./document/storage/aws-document-storage');
import ArticlesIndexImporter = require('./document/import/articles-index-importer');

import ListArticleSources = require('./operations/list-article-sources');
import ListDailyIndices = require('./operations/list-daily-indices');
import CaptureDailyIndex = require('./operations/capture-daily-index');
import GetArticlesIndexStatus = require('./operations/get-articles-index-status');
import ImportArticlesIndex = require('./operations/import-articles-index');

export module Dolphin.Events {
    export class Orchestrator {
        private handlerChain: EventHandlerChain;

        constructor() {
            var operationsHandler: OperationsHandler = new OperationsHandler();

            var articlesIndex: DynamodbArticlesIndex = new DynamodbArticlesIndex();
            var documentStorage: AwsDocumentStorage = new AwsDocumentStorage();

            operationsHandler.registerOperation(new ListArticleSources());
            operationsHandler.registerOperation(new ListDailyIndices());
            operationsHandler.registerOperation(new CaptureDailyIndex());
            operationsHandler.registerOperation(new GetArticlesIndexStatus(articlesIndex));
            operationsHandler.registerOperation(new ImportArticlesIndex(articlesIndex, new ArticlesIndexImporter(documentStorage)));

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