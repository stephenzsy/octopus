///<reference path="../../scripts/typings/aws-sdk/aws-sdk.d.ts"/>
///<reference path="../../scripts/typings/q/Q.d.ts"/>

import stream = require('stream');
import Q = require('q');
import AWS = require('aws-sdk');

export function readableToStringAsync(readable: stream.Readable): Q.Promise<string> {
    var deferred: Q.Deferred<string> = Q.defer<string>();
    var content: string = '';
    var completed: boolean = false;
    readable.on('data', (chunk: string) => {
        content += chunk;
    });
    readable.on('end', () => {
        completed = true;
        deferred.resolve(content);
    });
    readable.on('close', () => {
        if (!completed) {
            deferred.reject({});
        }
    });
    readable.on('error', (err: any) => {
        deferred.reject(err);
    });
    return deferred.promise;
}

export function awsQInvoke<Req, Res>(service: any, methodName: string, params: Req): Q.Promise<Res> {
    return <Q.Promise<Res>>Q.ninvoke(service, methodName, params);
}