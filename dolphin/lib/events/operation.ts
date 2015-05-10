import Request = require('./request');
import Result = require("./result");

interface Operation<T,U> {
    name:string;
    enact(request:Request<T>):Result<U>;
    validateInput(input:any):T;
}

export = Operation;
