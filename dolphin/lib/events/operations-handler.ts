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
    export class OperationsHandler implements EventHandler {
        private operations = {};

        private static METHOD_SIGNATURE_HEADER:string = "x-dolphin-method";

        before(event:Event):void {
            var methodSignature:string = event.request.get(OperationsHandler.METHOD_SIGNATURE_HEADER);
            var operation:Operation<any,any> = this.getOperation(methodSignature);
            var request:Request<any> = operation.validateInput(event.request);
            var result:Result<any> = operation.enact(request);
            event.result = result.toJsonObject();
        }

        after(event:Event):void {

        }

        private getOperation<T,U>(methodSignature:string):Operation<T,U> {
            var operationName:string = methodSignature;
            var operation:Operation<T,U> = this.operations[operationName];
            return operation;
            // TODO: throw error if not matched
        }

        registerOperation<T,U>(operation: Operation<T,U>):void {
            this.operations[operation.name] = operation;
        }
    }
}