///<reference path="../../scripts/typings/express/express.d.ts"/>

import Event = require('./event');
import EventHandlerChain = require('./event-handler-chain');
import JsonProtocolHandler = require('./json-protocol-handler');
import OperationsHandler = require('./operations-handler');
import express = require('express');

import ListArticleSources = require('../../app/operations/list-article-sources');

export module Dolphin.Events {
    export class Orchestrator {
        private handlerChain:EventHandlerChain;

        constructor() {
            var operationsHandler:OperationsHandler = new OperationsHandler();
            operationsHandler.registerOperation(new ListArticleSources());

            this.handlerChain = new EventHandlerChain([
                new JsonProtocolHandler(),
                operationsHandler
            ]);
        }

        orchestrate(req: express.Request, res: express.Response) {
            var event:Event = new Event();
            event.originalRequest = req;
            event.originalResponse = res;
            this.handlerChain.orchestrate(event);
        }
    }
}