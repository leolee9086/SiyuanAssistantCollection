import * as cheerio from '../../../../../static/cheerio.js'
import cfEmail from './utils/cf-email.js';
import commonConfig from './utils/common-config.js'
import { got } from './utils/got.js';
import parseDate from './utils/parse-date.js';
import commonUtils from './utils/common-utils.js';
import validHost from './utils/valid-host.js';
import rssParser from './utils/rss-parser.js'
import logger from './utils/logger.js'
import md5 from './utils/md5.js';
import wechatMap from './utils/wechat-mp.js'
import date from './utils/date.js';
import timezone from './utils/timezone.js';
import iconvPollyfill from '../iconvPollyfill.js';
import config from './config.js';
import { setLute } from '../../../../utils/copyLute.js';
import * as Url from './url.js';
import dayjs from '../../../../../static/dayjs.js'
import { asyncPool } from '../../../../utils/functionTools.js';
import render from './utils/render.js';
import path from '../../../../polyfills/path.js'
let moduleCache = {
    "/data/plugins/SiyuanAssistantCollection/installed/utils/got.js": got,
    "@/utils/cf-email": cfEmail,
    "@/utils/rss-parser": rssParser,
    "@/utils/got": got,
    "@/utils/parse-date": parseDate,
    "@/config": config,
    "@/utils/common-utils": commonUtils,
    "@/utils/valid-host": validHost,
    "@/utils/date": date,
    "@/utils/timezone": timezone,
    "@/utils/common-config": commonConfig,
    "@/utils/rss-parser": rssParser,
    "@/utils/logger": logger,
    "@/utils/md5": md5,
    "@/utils/dateParser": parseDate,
    "@/utils/render":render,
    "path":path,
    "iconv-lite": iconvPollyfill,
    got,
    cheerio,
    "markdown-it": (config = {}) => {
        return {
            render: setLute(config).md2HTML
        }
    },
    'url': Url,
    entities: {
        encode: function (str) {
            var div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        },
        decode: function (str) {
            var div = document.createElement('div');
            div.innerHTML = str;
            return div.textContent;
        },
        encodeNonUTF: function (str) {
            return str.split('').map(function (c) {
                return '&#' + c.charCodeAt(0) + ';';
            }).join('');
        },
        decodeNonUTF: function (str) {
            return str.replace(/&#(\d+);/g, function (match, dec) {
                return String.fromCharCode(dec);
            });
        }
    },
    "tiny-async-pool": asyncPool,
    dayjs
};
globalThis[Symbol.for(`rss_mouleCache`)]=globalThis[Symbol.for(`rss_mouleCache`)]||moduleCache
export default globalThis[Symbol.for(`rss_mouleCache`)]