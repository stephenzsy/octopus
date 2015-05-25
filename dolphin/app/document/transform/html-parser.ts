///<reference path="../../../scripts/typings/cheerio/cheerio.d.ts"/>
import cheerio = require('cheerio');

interface TParse {
    [selector: string]: TParse|string|any;
    _entry_?: TParseEntry[];
    _each_?: TParse;
}

interface TParseEntry {
    key:string;
    value:string;
    target:string;
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
            var target = _cthis.getEntryData(data, t.target);
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
                var m:RegExpMatchArray = t.value.match(/^attr:(.*)$/);
                if (m) {
                    value = nodes.attr(m[1]).trim();
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

    private tParse($:CheerioStatic, nodes:Cheerio, t:TParse, data:any, required?:boolean):void {
        if (nodes.length == 0 && required) {
            throw 'Need developer';
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
                case '_data_':
                    var scopeData = {};
                    var dataDirective: TParse = <TParse>t[selector];
                    for (var key in dataDirective) {
                        switch (key) {
                            case '_append_':
                                var dataKey = <string>dataDirective[key];
                                var dataKeyParts = dataKey.split('.');
                                parser.getEntryData(data, dataKey).push(scopeData);
                                break;
                            default:
                                var directive: string = <string>dataDirective[key];
                                if (directive === 'text') {
                                    scopeData[key] = nodes.text();
                                    break;
                                }
                                var m: RegExpMatchArray = directive.match(/^attr:(.*)$/);
                                if (m) {
                                    scopeData[key] = nodes.attr(m[1]);
                                    break;
                                }
                        }
                    }
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
