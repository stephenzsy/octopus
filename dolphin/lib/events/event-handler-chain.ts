///<reference path="./event-handler.ts"/>

export module Dolphin.Events {

    class HandlerContainer {
        handler:EventHandler;
        next:HandlerContainer;

        constructor(handler:EventHandler, next:HandlerContainer) {
            this.handler = handler
            this.next = next;
        }
    }

    export class EventHandlerChain {
        private chainHead:HandlerContainer;

        constructor(handlers:EventHandler[]) {
            var chainHead:HandlerContainer = null;
            handlers.forEach(function (handler:EventHandler) {
                var e = new HandlerContainer(handler, chainHead);
                chainHead = e;
            });
            this.chainHead = chainHead;
        }

        private orchestrateChain(event:Event, chain:HandlerContainer):void {
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
