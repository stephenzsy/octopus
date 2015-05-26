///<reference path="../../../scripts/typings/cheerio/cheerio.d.ts"/>
///<reference path="../../../scripts/typings/validator/validator.d.ts"/>
///<reference path="../../../scripts/typings/moment/moment.d.ts"/>

import cheerio = require('cheerio');
import validator = require('validator');
import moment = require("moment");

interface TParse {
    [selector: string]: TParse|string|any;
    _entry_?: TParseEntry[];
    _each_?: TParse;
    _data_?: TData;
    _traverse_?: TTraverse;
}

interface TData {
    [key:string] :string;
    _append_?: string;
    _tag_?:string;
    _newScope_?: string;
}

interface TTraverse {
    [selectorMatch: string]: TParse;
    __properties__?: {[selector: string]:string};
}

interface TParseEntry {
    key:string;
    value:string;
    target?:string;
}

interface HtmlParserConfig {
    version: string;
    dataInit: { [s: string]: string; };
    tParse: TParse;
}

class HtmlParser {

    static Version: string = '2015-05-18';
    private config: HtmlParserConfig;

    constructor(config: HtmlParserConfig) {
        this.config = config;
    }

    private handleEntry(nodes:Cheerio, ts:TParseEntry[], data:any):void {
        var _cthis = this;
        ts.forEach(function (t:TParseEntry) {
            var target = t.target ? _cthis.getEntryData(data, t.target) : data;
            var key = null;
            var value = null;
            {
                var m:RegExpMatchArray = t.key.match(/^attr:(.*)$/);
                if (m) {
                    key = nodes.attr(m[1]).trim();
                } else {
                    key = t.key;
                }
            }
            {
                var m:RegExpMatchArray = t.value.match(/^(\w+:)?attr:(.*)$/);
                if (m) {
                    value = nodes.attr(m[2]).trim();
                    if (m[1]) {
                        var func:string = m[1];
                        switch (func) {
                            case 'secondsFromEpoch:':
                                value = moment.unix(validator.toInt(value)).utc().toISOString();
                                break;
                        }
                    }
                } else {
                    switch (t.value) {
                        case 'text':
                            value = nodes.text().trim();
                    }
                }
            }
            target[key] = value;
        });
    }

    private handleText(text:string, tp:TParse, data:any) {
        text = text.trim();
        if (text.length == 0) return;
        if (tp._data_) {
            this.handleData(null, tp._data_, data, text);
        }
    }

    private handleTraverse($:CheerioStatic, nodes:Cheerio, tt:TTraverse, data:any) {
        var parser:HtmlParser = this;
        nodes.contents().each(function (index:number, element:CheerioElement) {
            if(element.type === 'comment') {
                return;// skip comment;
            }
            var matched:boolean = false;
            for (var selectorMather in tt) {
                var metaMatcher:RegExpMatchArray = selectorMather.match(/^_(\w+)_$/);
                if (metaMatcher) {
                    switch (metaMatcher[1]) {
                        case 'data':
                            // skip
                            break;
                        case 'text':
                            if (element.type === 'text') {
                                matched = true;
                                var elementText = element.data.trim();
                                parser.handleText(element.data, tt[selectorMather], data);
                            } // else skip
                            break;
                    }
                } else {
                    var node:Cheerio = $(element);
                    if (node.is(selectorMather)) {
                        matched = true;
                        var newScope:any = data;
                        if (tt[selectorMather]._data_) {
                            newScope = parser.handleData(node, tt[selectorMather]._data_, data);
                        }
                        parser.handleTraverse($, node, tt, newScope);
                    }
                }
                if (matched) {
                    break;
                }
            }
            if (!matched) {
                if(tt.__properties__['exhaustive']) {
                    console.error('Unmatched element');
                    console.error(element);
                    throw 'Unmatched element';
                }
            }
        });
    }

    private handleData(nodes:Cheerio, td:TData, data:any, plainText?:string):any {
        var scopeData = {};
        for (var key in td) {
            var metaMatcher:RegExpMatchArray = key.match(/^_\w+_$/);
            if (!metaMatcher) {
                var directive:string = td[key];
                if (directive === 'text') {
                    if (plainText) {
                        this.setEntryValue(scopeData, key, plainText);
                    } else {
                        this.setEntryValue(scopeData, key, nodes.text());
                    }
                } else {
                    var mm:RegExpMatchArray = directive.match(/^(\w+):(.*)$/);
                    if (mm) {
                        switch (mm[1]) {
                            case 'attr':
                                this.setEntryValue(scopeData, key, nodes.attr(mm[2]));
                                break;
                            case 'value':
                                switch (mm[2]) {
                                    case '[]':
                                        this.setEntryValue(scopeData, key, []);
                                        break;
                                }
                                break;
                        }
                    }
                }
            }
        }
        if (td._append_) {
            var dataKey = td._append_;
            if (dataKey === '.') {
                data.push(scopeData);
            } else {
                this.getEntryData(data, dataKey).push(scopeData);
            }
        }
        if (td._newScope_) {
            return this.getEntryData(scopeData, td._newScope_);
        }
        return data;
    }

    private tParse($:CheerioStatic, nodes:Cheerio, t:TParse, data:any, required?:boolean):void {
        if (nodes.length == 0 && required) {
            console.log(t);
            throw 'Required not present: Need developer';
        }
        var parser: HtmlParser = this;
        for (var selectorKey in t) {
            var nextLevelRequired = false;
            var selector = selectorKey;
            var m = selectorKey.match(/^_required_:(.*)$/);
            if (m) {
                selector = m[1];
                nextLevelRequired = true;
            }
            switch (selector) {
                case '_each_':
                    nodes.each(function (index: number, element: CheerioElement) {
                        parser.tParse($, $(element), t._each_, data);
                    });
                    break;
                case '_entry_':
                    parser.handleEntry(nodes, t._entry_, data);
                    break;
                case '_traverse_':
                    var traverseScopedDta = data;
                    if (t._traverse_.__properties__['newScope']) {
                        traverseScopedDta = this.getEntryData(data, t._traverse_.__properties__['newScope']);
                    }
                    this.handleTraverse($, nodes, t._traverse_, traverseScopedDta);
                    break;
                case '_data_':
                    parser.handleData(nodes, t._data_, data);
                    break;
                default:
                    this.tParse($, nodes.find(selector), <TParse>t[selectorKey], data, nextLevelRequired);
            }
        }
    }

    private getDataObject(root: any, k: string[]): any {
        var dict: any = root;
        for (var i: number = 0; i < k.length - 1; ++i) {
            dict[k[i]] = dict[k[i]] || {};
            dict = dict[k[i]];
        }
        return dict;
    }

    private getEntryData(root:any, k:string):any {
        var ks:string[] = k.split('.');
        return this.getDataObject(root, ks)[ks[ks.length - 1]];
    }

    private setEntryValue(root:any, k:string, v:any):void {
        var ks:string[] = k.split('.');
        this.getDataObject(root, ks)[ks[ks.length - 1]] = v;
    }

    private initData(): any {
        var root = {};
        var _cthis = this;
        for (var key in this.config.dataInit) {
            var strValue: string = this.config.dataInit[key];
            var value: any = null;
            if (strValue === '[]') {
                value = [];
            } else if (strValue === '{}') {
                value = {};
            }

            _cthis.setEntryValue(root, key, value);
        }
        return root;
    }

    parse($: CheerioStatic): any {
        var data: any = this.initData();
        this.tParse($, $.root(), this.config.tParse, data);
        return data;
    }

    get version(): string {
        return HtmlParser.Version + ':' + this.config.version;
    }
}

export = HtmlParser;
