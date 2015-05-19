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

    private tTransform($: Cheerio, t: TTransform): Cheerio {
        for (var selector in t) {
            var m: RegExpMatchArray = selector.match(/^_only_:(.*)$/);
            if (m) {
                var s: string = m[1];
                var onlySelected: Cheerio = $.find(s);
                onlySelected.remove();
                $.children().remove();
                $.append(this.tTransform(onlySelected, <TTransform>t[selector]));
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
