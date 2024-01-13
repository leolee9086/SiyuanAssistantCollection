import { tipsUIRouter } from './UI/router.js'
export { tipsUIRouter as router }
import { sac } from './runtime.js';
import { tipsRenderPackage } from './package/package.js';
import { 加载渲染实例, 加载渲染器类, } from './package/loader.js';
//这是内部的tips实现,分别是根据文字进行搜索和根据向量进行搜索
import { tipsRender as vectorTipsRender } from './builtinRenders/vectorTipsRender.js';
import { tipsRender as textTipsRender } from './builtinRenders/textTipsRender.js';
import { 显示tips } from './显示tips.js';
import { initVueApp } from '../../UI/utils/componentsLoader.js';
import { 获取选区屏幕坐标 } from '../../utils/rangeProcessor.js';
import { 输入事件发生在protyle内部 } from '../../utils/events/isIn.js';
import { markElementIfMouseOver } from './mouseTips.js';

markElementIfMouseOver(document);
await sac.statusMonitor.set('tips', 'current', [])
export const packages = [tipsRenderPackage]
const 构建tips显示界面 = (element, data) => {
    let app = initVueApp(
        import.meta.resolve('./UI/components/tipsCards.vue'),
        'tipsCards',
        {},
        sac.localPath + '/source',
        { appData: data }
    )
    app.mount(element.querySelector('#SAC-TIPS'))
}
export const docks = {
    TipsMain: {
        async init(element) {
            构建tips显示界面(element)
        }
    }
}
export const tabs = {
    focusedTips: {
        init(element, data, tab) {
            element.innerHTML = `
      <div id="SAC-TIPS_pinned"  style="overflow:auto;max-height:30%"></div>
      <div id="SAC-TIPS" class='fn__flex-1' style="overflow:auto;max-height:100%">
            
      </div>
   
        `;
            构建tips显示界面(element, data)
        }
    }
}
export const Emitter = class {
    async onload() {
        加载渲染器类(textTipsRender, 'textSearchTips')
        加载渲染器类(vectorTipsRender, 'vectorSearchTips')
        const tipsRenderPackagesAsync = async () => { return await sac.statusMonitor.get('packages', 'sac-tips-render').$value }
        let tipsPackagesDefine = await tipsRenderPackagesAsync()
        let tipsRenders = await tipsPackagesDefine.local.list()
        for (let renderName of tipsRenders) {
            await 加载渲染实例(tipsPackagesDefine, renderName);
        }
    }
    channel = 'tips-ui';
    ["@main-" + sac.事件管理器.DOM键盘事件表.文本输入] = (e) => {
        if (输入事件发生在protyle内部) {
            显示tips()
        }
    }
    ["@main-" + sac.事件管理器.DOM键盘事件表.组合结束] = (e) => {
        if (输入事件发生在protyle内部) {
            显示tips()
        }
    }
}
