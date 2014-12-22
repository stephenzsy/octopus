var util = require("util");
var http = require('http');
var DocumentRepository = require('./document_repository');

(function () {
    "use strict";

    function HttpExternalRepository() {
        DocumentRepository.call(this);
    }

    util.inherits(HttpExternalRepository, DocumentRepository);

    HttpExternalRepository.prototype.retrieveDocument = function (url, callback) {
        console.log("URL: " + url);
        http.get(url, function (res) {
            if (res.statusCode >= 300 && res.statusCode < 400) {
                console.log("Redirect to: " + res.headers['location']);
            }
            console.log(res.statusCode);
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                callback(data);
            });
        }).on('error', function (e) {
            console.log("Got error: " + e.message);
        });
    };

    module.exports = HttpExternalRepository;

})();
