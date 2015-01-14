var cheerio = require('cheerio');
var Q = require('q');

(function () {
    "use strict";

    function DocumentParser(/*tree file*/ model) {
        this.model = model['model'];
        this.modelVersion = model['version'];
        this.isDev = (model['dev'] === true);
    }

    function applyRules(nodes, rules, dataScope) {
        var parentDataScope = dataScope;
        rules.forEach(function (rule) {
            for (var directive in rule) {
                var op = rule[directive];
                switch (directive) {
                    case 'data':
                        switch (op['action']) {
                            case 'beginScope':
                                switch (op['type']) {
                                    case 'array':
                                        dataScope = [];
                                        break;
                                    case 'object':
                                        dataScope = {};
                                        break;
                                }
                                break;
                            case 'collect':
                                switch (op['type']) {
                                    case 'attribute':
                                        dataScope[op['dataKey']] = nodes.attr(op['attributeKey']);
                                        break;
                                    case 'text':
                                        dataScope[op['dataKey']] = nodes.text();
                                        break;
                                }
                                break;
                            case 'appendToParent':
                                parentDataScope.push(dataScope);
                                break;
                        }
                        break;
                    case 'filters':
                        var parsed = parseParts(nodes, op, dataScope, false);
                        if (!dataScope) {
                            dataScope = parsed;
                        }
                        break;
                    case 'each':
                        nodes.each(function () {
                            applyRules(this, op, dataScope);
                        });
                        break;
                    case 'action':
                        var action = op;
                        switch (action) {
                            case 'remove':
                                nodes.remove();
                                break;
                            case 'inspect':
                                console.log(nodes.html());
                                break;
                            case 'inspectRaw':
                                console.log(nodes);
                                break;
                        }
                }
            }
        });
        return dataScope;
    }

    function parseParts(root, model, dataScope, isRoot) {
        for (var filter in model) {
            if (isRoot) {
                var result = applyRules(root(filter), model[filter], dataScope);
            } else {
                var result = applyRules(root.find(filter), model[filter], dataScope);
            }
            if (!dataScope && result) {
                dataScope = result;
            }
        }
        return dataScope;
    }

    DocumentParser.prototype.parse = function (documentContent) {
        var $ = cheerio.load(documentContent);
        var meta = $('meta');
        var keys = Object.keys(meta);
        keys.forEach(function (key) {
            console.log(meta[key].attribs);
        });
        var parsed = parseParts($, this.model, null, true);
        if (this.isDev) {
            console.log(parsed);
            throw "Parser In Development";
        }
        return parsed;
    };

    DocumentParser.prototype.getModelVersion = function () {
        return this.modelVersion;
    };

    module.exports = DocumentParser;

})();