///<reference path="../../../scripts/typings/cheerio/cheerio.d.ts"/>
import cheerio = require('cheerio');

interface TParse {
    [selector: string]: TParse|string;
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

    private tParse($: CheerioStatic, nodes: Cheerio, t: TParse, data: any): void {
        var parser: HtmlParser = this;
        for (var selector in t) {
            switch (selector) {
                case '_each_':
                    var tt: TParse = <TParse>t[selector];
                    nodes.each(function (index: number, element: CheerioElement) {
                        parser.tParse($, $(element), tt, data);
                    });
                    break;
                case '_data_':
                    var scopeData = {};
                    var dataDirective: TParse = <TParse>t[selector];
                    for (var key in dataDirective) {
                        switch (key) {
                            case '_append_':
                                var dataKey = <string>dataDirective[key];
                                var dataKeyParts = dataKey.split('.');
                                parser.getDataObject(data, dataKeyParts)[dataKeyParts[dataKeyParts.length - 1]].push(scopeData);
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
                    this.tParse($, nodes.find(selector), <TParse>t[selector], data);
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

    private initData(): any {
        var root = {};
        for (var key in this.config.dataInit) {
            var strValue: string = this.config.dataInit[key];
            var value: any = null;
            if (strValue === '[]') {
                value = [];
            }

            var k: string[] = key.split('.');
            var dict: any = this.getDataObject(root, k);
            dict[k[k.length - 1]] = value;
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
