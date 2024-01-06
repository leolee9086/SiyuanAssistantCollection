import * as cheerio from '../../../../static/cheerio.js';
import { got } from '../../../utils/network/got.js'
import { kernelApi } from '../../../asyncModules.js';
import { jieba } from '../../../utils/tokenizer/jieba.js';
import { sac } from '../../../asyncModules.js';
export const renderInstancies = []

// 定义加载渲染实例的函数
export async function 加载渲染实例(tipsPackagesDefine, renderName) {
    let renderClass = await tipsPackagesDefine.local.load(renderName);
    let renderInstance = new renderClass();
    初始化渲染实例(renderInstance, renderName);
    renderInstancies.push(renderInstance);
    console.log("tips渲染器实例加载",renderName,renderInstance,renderInstancies);
    return renderInstancies
}
// 定义初始化渲染实例的函数
function 初始化渲染实例(renderInstance, renderName) {
    renderInstance.__proto__.sac = sac;
    renderInstance.__proto__.internalFetch = sac.路由管理器.internalFetch;
    renderInstance.__proto__.name = renderName;
    renderInstance.__proto__.cut = jieba.cut;
    renderInstance.__proto__.loadUrlHTML = async (url, options) => {
        const res = await got(url, options);
        return cheerio.load(res.body);
    };
    renderInstance.__proto__.got = got;
    renderInstance.__proto__.Lute = Lute;
    renderInstance.__proto__.kernelApi = kernelApi;
}