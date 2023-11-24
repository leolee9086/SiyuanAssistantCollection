import { plugin } from "../../asyncModules.js"

export const getPersonaSetting = (name,...args) => {
    console.log(plugin.configurer.get( name+"_personaSetting",...args).$raw,plugin.configurer.get(...args).$raw,name,args)
    if (plugin.configurer.get( name+"_personaSetting",...args).$raw!==undefined) {
        return plugin.configurer.get( name+"_personaSetting",...args)
    } else {
        return plugin.configurer.get(...args)
    }
}
export const initPersonaSetting = (name) => {
    plugin._setting.聊天工具设置.AI个别设置=plugin._setting.聊天工具设置.AI个别设置||{}
    plugin._setting.聊天工具设置.AI个别设置[name] = plugin._setting.聊天工具设置.AI个别设置[name] ? plugin._setting.聊天工具设置.AI个别设置[name] : {
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
       // data['模型设置'] =plugin._setting[name+"_personaSetting"]&&plugin._setting[name+"_personaSetting"]['模型设置']||data['模型设置'] 
        plugin._setting[name+"_personaSetting"] = JSON.parse(JSON.stringify(data))
        plugin.eventBus.emit('sac-rebuild-dialogs-setting')
    })
}
