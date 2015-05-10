///<reference path="../../scripts/typings/express/express.d.ts"/>

import _Event = require('./event');
import _EventHandlerChain = require('./event-handler-chain');
import _JsonProtocolHandler = require('./json-protocol-handler');
import _OperationsHandler = require('./operations-handler');
import express = require('express');

import EventHandlerChain = _EventHandlerChain.Dolphin.Events.EventHandlerChain;
import Event = _Event.Dolphin.Events.Event;
import JsonProtocolHandler = _JsonProtocolHandler.Dolphin.Events.JsonProtocolHandler;
import OperationsHandler = _OperationsHandler.Dolphin.Events.OperationsHandler;

import _ListArticleSources = require('../../api/operations/list-article-sources');
import ListArticleSources = _ListArticleSources.Dolphin.Api.Operations.ListArticleSources;

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