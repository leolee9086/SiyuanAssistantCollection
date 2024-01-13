import { initVueApp } from "../../UI/utils/componentsLoader.js"
export const tabs = {
    "loggerList": {
        init: (element, data, tab) => {
            const app = initVueApp(
                import.meta.resolve('./components/logger/loggerList.vue'),
                'rsscontent', {},
                'D:/思源主库/data/plugins/SiyuanAssistantCollection/source', { ...data })
            app.mount(element)

        }
    },
    "packageManage": {
        init: (element, data, tab) => {
            const app = initVueApp(
                import.meta.resolve('./components/packages/PackageCards.vue'),
                'rsscontent', {},
                'D:/思源主库/data/plugins/SiyuanAssistantCollection/source', { ...data })
            app.mount(element)

        }
    },
    "dataBaseManage":{
        init:(element, data, tab) => {
            const app = initVueApp(
                import.meta.resolve('./components/VectorDataCards.vue'),
                'rsscontent', {},
                'D:/思源主库/data/plugins/SiyuanAssistantCollection/source', { ...data })
            app.mount(element)

        }
    }
}
export const Emitter = class {
    channel = "admin";
    onload(){
        this.emit('open-tab',
        {
            title:"测试",
            type:"packageManage"
        })
    }
    ['@main-click-berry-button']=(e)=>{
        this.emit('open-tab',{
            'title':'扩展包管理',
            "type":'packageManage'
        })
    }
}
