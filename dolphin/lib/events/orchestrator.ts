///<reference path="../../scripts/typings/express/express.d.ts"/>

import Event = require('./event');
import EventHandlerChain = require('./event-handler-chain');
import JsonProtocolHandler = require('./json-protocol-handler');
import OperationsHandler = require('./operations-handler');
import express = require('express');

import DynamodbArticlesIndex = require('../../app/document/aws-dynamodb-articles-index');

import ListArticleSources = require('../../app/operations/list-article-sources');
import ListDailyIndices = require('../../app/operations/list-daily-indices');
import CaptureDailyIndex = require('../../app/operations/capture-daily-index');
import GetArticlesIndexStatus = require('../../app/operations/get-articles-index-status');

export module Dolphin.Events {
    export class Orchestrator {
        private handlerChain:EventHandlerChain;

        constructor() {
            var operationsHandler: OperationsHandler = new OperationsHandler();

            var articlesIndex: DynamodbArticlesIndex = new DynamodbArticlesIndex();

            operationsHandler.registerOperation(new ListArticleSources());
            operationsHandler.registerOperation(new ListDailyIndices());
            operationsHandler.registerOperation(new CaptureDailyIndex());
            operationsHandler.registerOperation(new GetArticlesIndexStatus(articlesIndex));

            this.handlerChain = new EventHandlerChain([
                new JsonProtocolHandler(),
                operationsHandler
            ]);
        }

        orchestrate(req:express.Request, res:express.Response) {
            var event:Event = new Event();
            event.originalRequest = req;
            event.originalResponse = res;
            this.handlerChain.orchestrate(event);
        }
    }
}