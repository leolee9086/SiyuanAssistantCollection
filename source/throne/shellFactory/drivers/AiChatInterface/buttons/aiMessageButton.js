import {plugin,clientApi,EventEmitter} from '../../../../runtime.js'
export class aiMessageButton extends EventEmitter {
    constructor({ doll, aiMessage, currentAiReply, userInput }) {
        super()
        this.doll = doll;
        this.aiMessage = aiMessage;
        this.currentAiReply = currentAiReply;
        this.userInput = userInput;
        this.button = document.createElement("button");
        this.button.classList.add("insert-button");
        this.button.setAttribute('aria-label', '插入到笔记');
        const img = document.createElement("img");
        img.src = this.doll.avatarImage || `${plugin.selfURL}/assets/laughingman.png`;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        this.button.appendChild(img);
        this.button.addEventListener("click", this.handleClick.bind(this));
        this.button.addEventListener("contextmenu", this.handleClick.bind(this));
        this.button.addEventListener("dragstart", this.handleDragStart.bind(this));
    }
    handleClick(event) {
        let detail = { 
            event, 
            message: this.currentAiReply, 
            userInput: this.userInput, 
            doll: this.doll, 
            button: this.button 
        }
        showAImenu(detail)
        this.emit('aiMessageButtonClicked',detail );
        event.stopPropagation()
    }
    async handleDragStart(event) {
        const messageContent = this.aiMessage.querySelector('.protyle-wysiwyg.protyle-wysiwyg--attr');
        event.dataTransfer.setData('text/plain', messageContent.innerText);
        let selectedIdElements = messageContent.querySelectorAll(`:scope > [data-node-id]`);
        let ids = Array.from(selectedIdElements).map(messageBlock => messageBlock.getAttribute('data-node-id'));
        ids = ids.join(',');
        for (let i = event.dataTransfer.items.length - 1; i >= 0; i--) {
            const item = event.dataTransfer.items[i];
            if (item.type !== 'text/plain') {
                event.dataTransfer.items.remove(i);
            }
        }
        navigator.clipboard.writeText(messageContent.innerHTML)
    }
}

const showAImenu = async (detail) => {
    window.siyuan.menus.menu.remove()
    let menu = new clientApi.Menu(
        'aiMessageButtonMenu', () => { }
    )
    //使用事件通知
    for (const pluginItem of plugin.app.plugins) {
        try {
            await pluginItem.eventBus.emit('sac-open-menu-aichatmessage', { ...detail,...{menu} });
        } catch (e) {
            console.warn(e, plugin);
        }
    }
    let rect = detail.button.getClientRects()[0]
    menu.addItem({
        icon: "iconFace",
        label:"在tab打开",
        click:()=>{
            plugin.eventBus.emit("openAiTab",detail.doll.ghost.persona.name)
        }
    })
    menu.open({
        x: rect.right - 25 - 76,
        y: rect.bottom,
        isLeft: false,
    });
    setTimeout(
        () => {
            let element = window.siyuan.menus.menu.element
            element.style ? element.style.left = element.getClientRects()[0].left - element.getClientRects()[0].width / 2 : null
        }, 200)

}

