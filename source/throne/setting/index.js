import { plugin } from "../../asyncModules.js"

export const getPersonaSetting = (name) => {
    if (plugin.configurer.get("聊天工具设置", 'AI个别设置', name).$value) {
        plugin.configurer.get("聊天工具设置", 'AI个别设置', name).$value
    } else {
        return plugin.configurer.get("聊天工具设置").$value
    }
}
export const initPersonaSetting = (name) => {
    plugin.setting.聊天工具设置.AI个别设置=plugin.setting.聊天工具设置.AI个别设置||{}
    plugin.setting.聊天工具设置.AI个别设置[name] = plugin.setting.聊天工具设置.AI个别设置[name] ? plugin.setting.聊天工具设置.AI个别设置[name] : {
        "$value": "点击初始化",
        "$type": "button",
        "$emit": "sac-init-persona-setting" + name
    }
    plugin.eventBus.on('sac-init-persona-setting' + name, (e) => {
        let data = plugin.configurer.get("聊天工具设置").$value
        data =JSON.parse(JSON.stringify(data))
        data['AI个别设置'] = undefined
        data['默认AI'] = undefined
        //data['文档查询权限'] = 10
       // data['模型设置'] =plugin.setting[name+"_personaSetting"]&&plugin.setting[name+"_personaSetting"]['模型设置']||data['模型设置'] 
        plugin.setting[name+"_personaSetting"] = JSON.parse(JSON.stringify(data))
        plugin.eventBus.emit('sac-rebuild-dialogs-setting')
    })
}
