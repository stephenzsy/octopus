import stream = require('stream');
import Q = require('q');

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