var $ = require('cheerio');
var Q = require('q');

(function () {
    "use strict";

    function DocumentParser(/*tree file*/ model) {
        this.model = model['model'];
        this.modelVersion = model['version'];
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
                        parseParts(nodes, op, dataScope);
                        break;
                    case 'each':
                        nodes.each(function () {
                            applyRules($(this), op, dataScope);
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
        return parseParts($(documentContent), this.model);
    };

    module.exports = DocumentParser;

})();