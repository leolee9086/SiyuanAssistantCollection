import * as cheerio from '../../../../static/cheerio.js';
import { got } from '../../../utils/network/got.js'
import { kernelApi } from '../../../asyncModules.js';
import { jieba } from '../../../utils/tokenizer/jieba.js';
import { sac } from '../../../asyncModules.js';
import { 封装对象函数使用缓存 } from '../../../utils/functionAndClass/cacheAble.js';
import { 准备渲染项目 } from '../UI/render.js';
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
    renderInstance.__proto__.kernelApi = 封装对象函数使用缓存(kernelApi);
    renderInstance.__proto__.showTips = (data, editorContext) => {
        if (!editorContext) {
            console.warn(renderName + 'tips渲染出错', "没有提供合适的编辑器上下文")
        }
        try {
            let tips = sac.statusMonitor.get('tips', 'current').$value
            if(data){
                data.source = renderInstance.name
                data.item.forEach(
                    item => {
                        if (item) {
                            item.source = item.source || renderInstance.name
                            item.time = Date.now()
                            tips.push(准备渲染项目(item))
                        }
                    }
                )
    
            }
        } catch (e) {
            console.warn(renderName + 'tips渲染出错', e)
        }
    }
    return renderInstance
}