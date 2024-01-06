import { tipsUIRouter } from './UI/router.js'
export { tipsUIRouter as router }
import { sac } from './runtime.js';
import { tipsRenderPackage } from './package/package.js';
import { 加载渲染实例,加载渲染器类, } from './package/loader.js';
//这是内部的tips实现,分别是根据文字进行搜索和根据向量进行搜索
import { tipsRender as vectorTipsRender} from './builtinRenders/vectorTipsRender.js';
import { tipsRender as textTipsRender} from './builtinRenders/textTipsRender.js';
import { 显示tips,添加容器 } from './显示tips.js';
import { initVueApp } from '../../UI/utils/componentsLoader.js';
await sac.statusMonitor.set('tips','current',[])
export const packages = [tipsRenderPackage]
const 构建tips显示界面 = (element,data) => {
    /*try {
        显示tips()
    } catch (e) {
        console.error(e)
    }*/
    添加容器(element)
    let app =initVueApp(
        import.meta.resolve('./UI/components/tipsCards.vue'),
        'tipsCards',
        {},
        sac.localPath + '/source',
        {appData:data}
    )
    app.mount(element.querySelector('#SAC-TIPS'))
}
export const docks = {
    TipsMain: {
        async init(element) {
            console.log(element)
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
            构建tips显示界面(element,data)
        }
    }
}
export const Emitter = class {
    async onload() {
        加载渲染器类(textTipsRender,'textSearchTips')
        加载渲染器类(vectorTipsRender,'vectorSearchTips')
        const tipsRenderPackagesAsync = async () => { return await sac.statusMonitor.get('packages', 'sac-tips-render').$value }
        let tipsPackagesDefine = await tipsRenderPackagesAsync()
        let tipsRenders = await tipsPackagesDefine.local.list()
        for (let renderName of tipsRenders) {
            await 加载渲染实例(tipsPackagesDefine, renderName);
        }
    }
    channel = 'tips-ui';
    ["@main-" + sac.事件管理器.DOM键盘事件表.文本输入] = (e) => {
        显示tips(e)
    }
    ["@main-" + sac.事件管理器.DOM键盘事件表.组合结束] = (e) => {
        显示tips(e)
    }
}


