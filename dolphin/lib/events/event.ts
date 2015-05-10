///<reference path="../../scripts/typings/express/express.d.ts"/>

import express = require('express');

export module Dolphin.Events {
    export class Event {
        request: any; // request data object
        result: any; // result data object
        originalRequest: express.Request;
        originalResponse: express.Response;
        operation: string;
    }
}
