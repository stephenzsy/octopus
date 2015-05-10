///----<reference path="../../scripts/typings/express/express.d.ts"/>

import Event = require('./event');
import EventHandler = require('./event-handler');

class JsonProtocolHandler implements EventHandler {
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

export = JsonProtocolHandler;