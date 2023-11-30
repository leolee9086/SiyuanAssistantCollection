import * as cheerio from '../../../../static/cheerio.js'
import { plugin } from '../../../asyncModules.js';
import fs from '../../../polyfills/fs.js';
import path from '../../../polyfills/path.js'
import { got } from './utils/got.js';
import parseDate from './utils/parse-date.js';
import config from './config.js';
import commonUtils from './utils/common-utils.js';
import validHost from './utils/valid-host.js';
import date from './utils/date.js';
import { setLute } from '../../../utils/copyLute.js';
import { Url } from './url.js';
import {柯里化} from '../../../baseStructors/functionTools.js'
import timezone from './utils/timezone.js';
const getObject = (currentFile,key) => {
    const api = {
        got,
        cheerio,
        "@/utils/got": got,
        "@/utils/parse-date": parseDate,
        "@/config": config,
        "@/utils/common-utils": commonUtils,
        "@/utils/valid-host": validHost,
        "@/utils/date": date,
        "@/utils/timezone": timezone,
        "markdown-it": (config = {}) => {
            return {
                render: setLute(config).md2HTML
            }
        },
        'url': Url,
        entities : {
            encode: function(str) {
                var div = document.createElement('div');
                div.textContent = str;
                return div.innerHTML;
            },
            decode: function(str) {
                var div = document.createElement('div');
                div.innerHTML = str;
                return div.textContent;
            },
            encodeNonUTF: function(str) {
                return str.split('').map(function(c) {
                    return '&#' + c.charCodeAt(0) + ';';
                }).join('');
            },
            decodeNonUTF: function(str) {
                return str.replace(/&#(\d+);/g, function(match, dec) {
                    return String.fromCharCode(dec);
                });
            }
        }
    };
    // 如果 key 是一个相对路径，解析它
    if (key.startsWith('./') || key.startsWith('../')) {
        key = path.resolve(path.dirname(currentFile), key)+'.js';
    }

    // @ts-ignore
    if(api[key]){
        return api[key];
    }else{
        try{
            return loadRSS(key)}catch(e){
            console.warn (currentFile,key,e)
        }
    }
};
const _require = 柯里化(getObject)
const loadRSS = async (sourceURL) => {
    let code = await fs.readFile(sourceURL)
    const exportsObj = {};
    const moduleObj = {
        exports: exportsObj
    };
    code = "(function anonymous(require, module, exports){".concat(code, "\n return module.exports})\n//# sourceURL=").concat(sourceURL, "\n")
    try {
        return (window.eval(code))(_require(sourceURL), moduleObj, exportsObj)
    } catch (e) {
        throw e; // 抛出错误，以便在 loadAll 函数中处理
    }
}

const loadAll = async () => {
    let router = {}
    let successList = [];
    let failureList = [];
    try {
        let list = await fs.readDir(plugin.selfPath + '/installed/rss')
        for (let element of list) {
            if (element.isDir) {
                router[element.name] = {}
                let rssFiles = await fs.readDir(plugin.selfPath + '/installed/rss/' + element.name)
                for (let file of rssFiles) {
                    if (file.name.endsWith('.js')) {
                        try {
                            router[element.name][file.name.split('.')[0]] = await loadRSS(plugin.selfPath + '/installed/rss/' + element.name + '/' + file.name)
                            successList.push(file.name);
                        } catch (e) {
                            console.error(`Error loading RSS from ${file.name}:`, e)
                            failureList.push(file.name);
                        }
                    }
                }
            }
        }
    } catch (e) {
        console.error('Error reading directory:', e)
    }
    console.log(`Successfully loaded ${successList.length} RSS:`, successList);
    console.log(`Failed to load ${failureList.length} RSS:`, failureList);
    return router
}
export default loadAll