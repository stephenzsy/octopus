///<reference path="./event.ts"/>
import _Event = require('./event');

export module Dolphin.Events {
    import Event = _Event.Dolphin.Events.Event;

    export interface EventHandler {
        before(event:Event):void;
        after(event:Event):void;
    }
}
