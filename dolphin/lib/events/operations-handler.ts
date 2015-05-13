///<reference path="../../scripts/typings/express/express.d.ts"/>

import Event = require('./event');
import EventHandler = require('./event-handler');
import Operation = require('./operation');
import Request = require('./request');
import Result = require('./result');
import UserException = require('./user-exception');

class OperationsHandler implements EventHandler {
    private operations: { [s:string]:Operation<Request<any>,Result<any>> } = {};

    before(event: Event): void {
        var operation: Operation<Request<any>, Result<any>> = this.getOperation(event.operation);
        var request: Request<any> = operation.validateInput(event.request);
        if (operation.isAsync) {
            event.isAsync = true;
            var resultPromise: Q.Promise<Result<any>> = operation.enactAsync(request);
            event.asyncPromise = resultPromise.then((result: Result<any>): void => {
                event.result = result.toJsonObject();
            });
        } else {
            try {
                var result: Result<any> = operation.enact(request);
                event.result = result.toJsonObject();
            } catch (e) {
                if (e instanceof UserException) {
                    event.userException = e;
                    throw e;
                }
                throw e;
            }
        }
    }

    after(event: Event): void {

    }

    private getOperation(methodName: string): Operation<Request<any>, Result<any>> {
        var operation: Operation<Request<any>, Result<any>> = this.operations[methodName];
        return operation;
        // TODO: throw error if not matched
    }

    registerOperation(operation: Operation<any, any>): void {
        this.operations[operation.name] = operation;
    }
}

export = OperationsHandler;