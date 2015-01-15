var cheerio = require('cheerio');
var Q = require('q');

(function () {
    "use strict";

    function DocumentParser(/*tree file*/ model) {
        this.model = model['model'];
        this.modelVersion = model['version'];
        this.isDev = (model['dev'] === true);
        this.options = model['options'];
        if (this.options == null) {
            this.options = {};
        }
    }

    var WHITESPACE_PATTERN = new RegExp("\\s+", "m");

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
                                        if (op['toParentArray']) {
                                            dataScope.push(nodes.attr(op['dataValueField']));
                                        } else if (op['dataKeyFields']) {
                                            op['dataKeyFields'].forEach(function (field) {
                                                if (nodes.attr(field)) {
                                                    dataScope[nodes.attr(field)] = nodes.attr(op['dataValueField']);
                                                    return;
                                                }
                                            });
                                        } else {
                                            dataScope[op['dataKey']] = nodes.attr(op['attributeKey']);
                                        }
                                        break;
                                    case 'text':
                                        var text = nodes.text().trim();
                                        if (op['toParentArray']) {
                                            dataScope.push(text);
                                        } else {
                                            dataScope[op['dataKey']] = text;
                                        }
                                        break;
                                }
                                break;
                            case 'appendToParent':
                                if (op['key']) {
                                    parentDataScope[op['key']] = dataScope;
                                } else {
                                    parentDataScope.push(dataScope);
                                }
                                break;
                        }
                        break;
                    case 'filters':
                        var parsed = parseParts(nodes, op, dataScope);
                        if (!dataScope) {
                            dataScope = parsed;
                        }
                        break;
                    case 'each':
                        nodes.each(function () {
                            applyRules(cheerio(this), op, dataScope);
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

    function parseParts(root, model, dataScope) {
        for (var filter in model) {
            var result = applyRules(root.find(filter), model[filter], dataScope);
            if (!dataScope && result) {
                dataScope = result;
            }
        }
        return dataScope;
    }

    DocumentParser.prototype.parse = function (documentContent) {
        var $ = cheerio(documentContent);

        var rootDataScope = null;
        if (this.options["rootDataScope"] === 'object') {
            rootDataScope = {};
        }

        var parsed = parseParts($, this.model, rootDataScope);
        if (this.isDev) {
            console.log(parsed);
            throw "Parser In Development";
        }
        return parsed;
    }
    ;

    DocumentParser.prototype.getModelVersion = function () {
        return this.modelVersion;
    };

    module.exports = DocumentParser;

})
();