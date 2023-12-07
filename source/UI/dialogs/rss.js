import { clientApi,pluginInstance as plugin } from '../../asyncModules.js'
plugin.eventBus.on(
    "sac-open-dialog-addRss",()=>{
        let dialog 
        dialog= new clientApi.Dialog({
            title: '添加rss',
            content: `<div id="rss-add-interface" class='fn__flex-column' style="pointer-events: auto;overflow:hidden">
            <div class="config__tab-container_SAC config__tab-container--top" data-name="名称">
        <label class="fn__flex b3-label config__item">
            <div class="fn__flex-center fn__flex-1 ft__on-surface">
                名称
                
            </div>
            <span class="fn__space"></span>
        <input class="b3-text-field fn__flex-center fn__size200" step="1" min="0" max="102400" type="text" value=""></label><label class="fn__flex b3-label config__item">
            <div class="fn__flex-center fn__flex-1 ft__on-surface">
                路径
                
            </div>
            <span class="fn__space"></span>
        <input class="b3-text-field fn__flex-center fn__size200" step="1" min="0" max="102400" type="text" value=""></label><label class="fn__flex b3-label config__item">
            <div class="fn__flex-center fn__flex-1 ft__on-surface">
                周期
                
            </div>
            <span class="fn__space"></span>
        <input class="b3-text-field fn__flex-center fn__size200" step="1" min="0" max="102400" type="number" value="50"></label></div>
            </div>`,
            destroyCallback: () => {
                let els=  dialog.element.querySelectorAll('input')
                let [name,path,cacheTimeout]=els
                console.log(name.value,path.value,cacheTimeout.value)
                if(name.value&&path.value&&!(name.value==='添加RSS')){
                    plugin._setting.RSS[name.value]={
                        "名称": name.value,
                        "路径": path.value,
                        "周期": {
                            "$value": 50,
                            "$describe": "默认刷新间隔秒数"
                        }
                    }
                }
                plugin.eventBus.emit('sac-rebuild-dialogs-setting',{})
            },
            width: '600px',
            height: 'auto',
            transparent: false,
            disableClose: false,
            disableAnimation: false
        }, () => {
        });
    }
)