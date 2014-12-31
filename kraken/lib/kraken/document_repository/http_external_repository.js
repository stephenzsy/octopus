var util = require("util");
var http = require('http');
var Q = require('q');

(function () {
    "use strict";

    function HttpExternalRepository() {
    }

    HttpExternalRepository.prototype.retrieveDocument = function (url) {
        var resolved = false;
        var deferred = Q.defer();
        console.log("URL: " + url);
        http.get(url, function (res) {
            if (res.statusCode === 200) {
                var data = '';
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {
                    resolved = true;
                    deferred.resolve(data);
                });
                res.on('close', function () {
                    if (!resolved) {
                        deferred.reject("Connection closed for URL: " + url);
                    }
                })
            } else if (res.statusCode === 302) {
                var location = res.headers['location'];
                deferred.reject({type: 'redirect', location: location});
            } else {
                deferred.reject({
                    type: 'unknown',
                    message: "Bad response code: " + res.statusCode.toString() + ", for URL: " + url
                });
            }
        }).on('error', function (e) {
            deferred.reject(e);
        });
        return deferred.promise;
    };

    module.exports = HttpExternalRepository;

})();
