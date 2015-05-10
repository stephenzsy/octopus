///<reference path="./request.ts"/>
///<reference path="./result.ts"/>

import MRequest = require("./request");
import MResult = require("./result");

import Request = MRequest.Dolphin.Events.Request;
import Result = MResult.Dolphin.Events.Result;

export module Dolphin.Events {

    import Request = MRequest.Dolphin.Events.Request;
    export interface Operation<T,U> {
        name:string;
        enact(request:Request<T>):Result<U>;
        validateInput(input:any):T;
    }
}
