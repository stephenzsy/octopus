///<reference path="../../scripts/typings/express/express.d.ts"/>
///<reference path="../../scripts/typings/q/Q.d.ts"/>
import express = require('express');
import Q = require('q');

import UserException = require('./user-exception');

class Event {
    id: string;
    request: any; // request data object
    result: any; // result data object
    originalRequest: express.Request;
    originalResponse: express.Response;
    operation: string;
    userException: UserException;
    isAsync: boolean = false;
    asyncPromise: Q.Promise<void>;
}

export = Event;



