///<reference path="../../scripts/typings/express/express.d.ts"/>
///<reference path="../../scripts/typings/node-uuid/node-uuid.d.ts"/>
var uuid = require('uuid');

import Event = require('./event');
import EventHandler = require('./event-handler');

interface ResponseDataObject {
    RequestId:string;
    [s:string]:any;
}

class JsonProtocolHandler implements EventHandler {
    private operations = {};

    private static PROTOCOL_HEADER:string = "x-dolphin-protocol";
    private static SERVICE_NAME:string = 'Dolphin';
    private static API_VERSION:string = '20150501';
    private static METHOD_SIGNATURE_HEADER:string = "x-dolphin-method";

    before(event:Event):void {
        event.id = uuid.v4();
        // parse method signature
        var methodSignature:string = event.originalRequest.get(JsonProtocolHandler.METHOD_SIGNATURE_HEADER);
        event.operation = methodSignature;

        event.request = event.originalRequest.body;
    }

    after(event: Event): void {
        if (event.isAsync) {
            event.asyncPromise.done((result: void): void=> {
                var responseData: ResponseDataObject = event.result;
                responseData.RequestId = event.id;
                event.originalResponse.send(responseData);
            }, function(err){
                console.error(err);
                console.error(err.stack);
                throw err;
            });
        } else {
            var responseData: ResponseDataObject = event.result;
            responseData.RequestId = event.id;
            event.originalResponse.send(responseData);
        }
    }
}

export = JsonProtocolHandler;