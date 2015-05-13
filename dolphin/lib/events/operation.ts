///<reference path="../../scripts/typings/q/Q.d.ts"/>
import Q = require('q');

import Request = require('./request');
import Result = require("./result");
interface Operation<T, U> {
    name: string;
    enact(request: Request<T>): Result<U>;
    validateInput(input: any): T;
    isAsync?: boolean;
    enactAsync?(request: Request<T>): Q.Promise<U>;
}

export = Operation;
