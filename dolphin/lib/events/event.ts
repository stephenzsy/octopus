///<reference path="../../scripts/typings/express/express.d.ts"/>

import express = require('express');

import UserException = require('./user-exception');

class Event {
    id:string;
    request:any; // request data object
    result:any; // result data object
    originalRequest:express.Request;
    originalResponse:express.Response;
    operation:string;
    userException:UserException;
}

export = Event;



