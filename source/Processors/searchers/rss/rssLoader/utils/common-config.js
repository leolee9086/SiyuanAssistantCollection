import { cheerio,got } from '../../../runtime.js';
import date from './date.js'
import iconv from '../../iconvPollyfill.js'
// eslint-disable-next-line no-unused-vars
import  _parseDate  from './parse-date.js'
const {parseDate}= _parseDate
// eslint-disable-next-line no-unused-vars
import timezone from './timezone.js'

function transElemText($, prop) {
    const regex = new RegExp(/\$\((.*)\)/g);
    let result = prop;
    if (regex.test(result)) {
        // eslint-disable-next-line no-eval
        result = eval(result);
    }
    return result;
}

function replaceParams(data, prop, $) {
    const regex = new RegExp(/%(.*)%/g);
    let result = prop;
    let group = regex.exec(prop);
    while (group) {
        // FIXME Multi vars
        result = result.replace(group[0], transElemText($, data.params[group[1]]));
        group = regex.exec(prop);
    }
    return result;
}

function getProp(data, prop, $) {
    let result = data;
    if (Array.isArray(prop)) {
        for (const e of prop) {
            result = transElemText($, result[e]);
        }
    } else {
        result = transElemText($, result[prop]);
    }
    return replaceParams(data, result, $);
}

async function buildData(data) {
    const response = await got.get(data.url);
    const contentType = response.headers['content-type'] || '';
    // 若没有指定编码，则默认utf-8
    let charset = 'utf-8';
    for (const attr of contentType.split(';')) {
        if (attr.indexOf('charset=') >= 0) {
            charset = attr.split('=').pop();
        }
    }
    const responseData = charset === 'utf-8' ? response.data : iconv.decode((await got.get({ url: data.url, responseType: 'buffer' })).data, charset);
    const $ = cheerio.load(responseData);
    const $item = $(data.item.item);
    // 这里应该是可以通过参数注入一些代码的，不过应该无伤大雅
    return {
        link: data.link,
        title: getProp(data, 'title', $),
        description: getProp(data, 'description', $),
        allowEmpty: data.allowEmpty || false,
        item: $item
            .map((_, e) => {
                const $elem = (selector) => $(e).find(selector);
                return {
                    title: getProp(data, ['item', 'title'], $elem),
                    description: getProp(data, ['item', 'description'], $elem),
                    pubDate: getProp(data, ['item', 'pubDate'], $elem),
                    link: getProp(data, ['item', 'link'], $elem),
                    guid: getProp(data, ['item', 'guid'], $elem),
                };
            })
            .get(),
    };
}


buildData.transElemText = transElemText;
buildData.replaceParams = replaceParams;
buildData.getProp = getProp;
export default buildData