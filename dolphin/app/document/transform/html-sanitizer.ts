///<reference path="../../../scripts/typings/cheerio/cheerio.d.ts"/>
import cheerio = require('cheerio');

interface TTransform {
    [selector: string]: TTransform|string;
}

interface HtmlSanitizerConfig {
    version: string;
    tTransform: TTransform;
}

class HtmlSanitizer {

    static Version: string = '2015-05-15';
    private config: HtmlSanitizerConfig;

    constructor(config: HtmlSanitizerConfig) {
        this.config = config;
    }

    private purgeComments($:Cheerio) {
        $.contents().filter(function () { return this.type === 'comment'; }).remove();
    }

    private handleAttribute($:Cheerio, attr:string, t:TTransform|string):Cheerio {
        if (typeof t === 'string') {
            var instruction:string = <string> t;
            switch (instruction) {
                case 'remove':
                    $.removeAttr(attr);
                    break;
            }
        }
        return $;
    }

    private tTransform($: Cheerio, t: TTransform): Cheerio {
        for (var selector in t) {
            var m:RegExpMatchArray = selector.match(/^_(\w+)_:(.*)$/);
            if (m) {
                var directive:string = m[1];
                var s:string = m[2];
                switch (directive) {
                    case 'only':
                        var onlySelected:Cheerio = $.find(s);
                        onlySelected.remove();
                        $.children().remove();
                        $.append(this.tTransform(onlySelected, <TTransform>t[selector]));
                        break;
                    case 'attr':
                        this.handleAttribute($, s, t[selector]);
                        break;
                }
            } else if (selector === '_comments_') {
                this.purgeComments($);
                continue;
            } else {
                var selected: Cheerio = $.find(selector);
                if (typeof t[selector] === 'string') {
                    switch (t[selector]) {
                        case 'remove': selected.remove();
                            break;
                    }
                } else {
                    this.tTransform(selected, <TTransform>t[selector]);
                }
            }
        }
        return $;
    }

    sanitize($: CheerioStatic) {
        this.tTransform($.root(), this.config.tTransform);
        return $;
    }

    get version(): string {
        return HtmlSanitizer.Version + ':' + this.config.version;
    }
}

export = HtmlSanitizer;
