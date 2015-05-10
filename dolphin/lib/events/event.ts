///<reference path="../../scripts/typings/express/express.d.ts"/>

import express = require('express');

class Event {
    request:any; // request data object
    result:any; // result data object
    originalRequest:express.Request;
    originalResponse:express.Response;
    operation:string;
}

export = Event;



