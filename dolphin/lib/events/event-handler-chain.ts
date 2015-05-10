import MEventHandler = require('./event-handler');
import _Event = require('./event');

import EventHandler = MEventHandler.Dolphin.Events.EventHandler;
import Event = _Event.Dolphin.Events.Event;

export module Dolphin.Events {

    class HandlerContainer {
        handler:EventHandler;
        next:HandlerContainer;

        constructor(handler:EventHandler, next:HandlerContainer) {
            this.handler = handler;
            this.next = next;
        }
    }

    export class EventHandlerChain {
        private chainHead:HandlerContainer;

        constructor(handlers:EventHandler[]) {
            var chainHead:HandlerContainer = null;
            for (var i:number = handlers.length - 1; i >= 0; --i) {
                var e:HandlerContainer = new HandlerContainer(handlers[i], chainHead);
                chainHead = e;
            }
            this.chainHead = chainHead;
        }

        private orchestrateChain(event:Event, chain:HandlerContainer):void {
            if(!chain) {
                return;
            }
            var handler:EventHandler = chain.handler;
            handler.before(event);
            this.orchestrateChain(event, chain.next);
            handler.after(event);
        }

        orchestrate(event:Event) {
            this.orchestrateChain(event, this.chainHead);
        }
    }
}
