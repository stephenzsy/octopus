///<reference path="../../scripts/typings/express/express.d.ts"/>

import Event = require('./event');
import EventHandler = require('./event-handler');
import Operation = require('./operation');
import Request = require('./request');
import Result = require('./result');
import UserException = require('./user-exception');

class OperationsHandler implements EventHandler {
    private operations = {};

    before(event:Event):void {
        var operation:Operation<any,any> = this.getOperation(event.operation);
        var request:Request<any> = operation.validateInput(event.request);
        try {
            var result:Result<any> = operation.enact(request);
            event.result = result.toJsonObject();
        } catch (e) {
            if (e instanceof UserException) {
                event.userException = e;
                throw e;
            }
            throw e;
        }
    }

    after(event:Event):void {

    }

    private getOperation<T,U>(methodName:string):Operation<T,U> {
        var operation:Operation<T,U> = this.operations[methodName];
        return operation;
        // TODO: throw error if not matched
    }

    registerOperation<T,U>(operation:Operation<T,U>):void {
        this.operations[operation.name] = operation;
    }
}

export = OperationsHandler;