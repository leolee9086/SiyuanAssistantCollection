import { initVueApp } from "../../UI/utils/componentsLoader.js"
export const tabs = {
    "packageManage": {
        init: (element, data, tab) => {
            const app = initVueApp(
                import.meta.resolve('./components/PackageCards.vue'),
                'rsscontent', {},
                'D:/思源主库/data/plugins/SiyuanAssistantCollection/source', { ...data })
            app.mount(element)

        }
    }
}
export const Emitter = class {
    channel = "admin";
    ['@main-click-berry-button']=(e)=>{
        this.emit('open-tab',{
            'title':'扩展包管理',
            "type":'packageManage'
        })
    }
}
