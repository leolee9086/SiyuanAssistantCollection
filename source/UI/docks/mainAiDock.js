import { plugin } from "../../asyncModules.js";
import throneManager from '../../throne/index.js'
const element = await plugin.statusMonitor.get('dockContainers', 'main').$value;
element?(await throneManager.buildDoll(await plugin.configurer.get('聊天工具设置', '默认AI').$value
)).createInterface(
    {
        type: 'textChat',
        describe: '一个HTML用户界面,用于向用户展示图文信息',
        container: element.querySelector('#ai-chat-interface'),
    }
):null
plugin.eventBus.on('dockConainerInited', async () => {
    const element = await plugin.statusMonitor.get('dockContainers', 'main').$value;
    console.log(element);
    (await throneManager.buildDoll(await plugin.configurer.get('聊天工具设置', '默认AI').$value)).createInterface(
        {
            type: 'textChat',
            describe: '一个HTML用户界面,用于向用户展示图文信息',
            container: element.querySelector('#ai-chat-interface'),
        }
    );
})