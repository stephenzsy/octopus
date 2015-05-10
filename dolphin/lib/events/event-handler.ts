import Event = require('./event');

interface EventHandler {
    before(event:Event):void;
    after(event:Event):void;
}

export = EventHandler;