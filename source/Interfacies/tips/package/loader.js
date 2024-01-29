import * as cheerio from '../../../../static/cheerio.js';
import { got } from '../../../utils/network/got.js'
import { kernelWorker } from '../../../utils/webworker/kernelWorker.js';
import { jieba } from '../../../utils/tokenizer/jieba.js';
import { sac } from '../../../asyncModules.js';
import {  处理并显示tips } from '../UI/render.js';
import BlockHandler from '../../../utils/BlockHandler.js';
import { actionsRouter,actionFetch, postAction } from '../actionRouter.js/index.js';
export const renderInstancies = []
// 定义加载渲染实例的函数
export async function 加载渲染实例(tipsPackagesDefine, renderName) {
    let renderClass = await tipsPackagesDefine.local.load(renderName);
    return 加载渲染器类(renderClass, renderName)
}
export function 加载渲染器类(renderClass, renderName) {
    let renderInstance = 初始化渲染实例(renderClass, renderName);
    renderInstancies.push(renderInstance);
    console.log("tips渲染器实例加载", renderName, renderInstance, renderInstancies);
    return renderInstancies
}
// 定义初始化渲染实例的函数
function 初始化渲染实例(renderClass, renderName) {
    let renderInstance = new renderClass();
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
    renderInstance.__proto__.actionsRouter=actionsRouter
    renderInstance.__proto__.fetchAction=actionFetch
    renderInstance.__proto__.postAction=postAction
    renderInstance.__proto__.kernelApi = kernelWorker
    renderInstance.__proto__.getBlockHandler=(id)=>{return new BlockHandler(id)}
    renderInstance.__proto__.showTips = (data, editorContext) => {
        if (!editorContext) {
            console.warn(renderName + 'tips渲染出错', "没有提供合适的编辑器上下文")
        }
        try {
            if(data){
                处理并显示tips(data,editorContext,renderInstance)
            }
        } catch (e) {
            console.warn(renderName + 'tips渲染出错', e)
        }
    }
    return renderInstance
}