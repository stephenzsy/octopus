///<reference path="./event.ts"/>

module Dolphin.Events {
    export interface EventHandler {
        before(event:Event):void;
        after(event:Event):void;
    }
}
