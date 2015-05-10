///<reference path="../../scripts/typings/express/express.d.ts"/>

import _Event = require('./event');
import _EventHandler = require('./event-handler');
import _Operation = require('./operation');
import _Request = require('./request');
import _Result = require('./result');

import EventHandler = _EventHandler.Dolphin.Events.EventHandler;
import Event = _Event.Dolphin.Events.Event;
import Operation = _Operation.Dolphin.Events.Operation;
import Request = _Request.Dolphin.Events.Request;
import Result = _Result.Dolphin.Events.Result;

export module Dolphin.Events {
    export class JsonProtocolHandler implements EventHandler {
        private operations = {};

        private static PROTOCOL_HEADER:string = "x-dolphin-protocol";
        private static SERVICE_NAME:string = 'Dolphin';
        private static API_VERSION:string = '20150501';
        private static METHOD_SIGNATURE_HEADER:string = "x-dolphin-method";

        before(event:Event):void {
            // parse method signature
            var methodSignature:string = event.originalRequest.get(JsonProtocolHandler.METHOD_SIGNATURE_HEADER);
            event.operation = methodSignature;

            event.request = event.originalRequest.body;
        }

        after(event:Event):void {
            event.originalResponse.send(event.result);
        }
    }
}