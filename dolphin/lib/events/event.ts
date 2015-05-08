///<reference path="../../scripts/typings/express/express.d.ts"/>

module Dolphin.Events {
    export class Event {
        request:Express.Request;
        response:Express.Response;
    }
}
