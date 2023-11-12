import { string2DOM } from "../../../../../UI/builders/index.js"
import { plugin } from "../../../../../asyncModules.js";
import { renderLinkMap } from "../../renders/linkMapRender.js";
export const 创建AI消息卡片=(message,linkMap,images,doll)=>{
    const aiMessage = string2DOM(`
        <div class="ai-message" data-message-id="${message.id}" draggable="true"></div>
    `);
    let lute =getLuteInstance()

    if (images) {
        let imageTags = ""
        let imageRows = [];
        for (let i = 0; i < images.length; i += 3) {
            let imageCols = images.slice(i, i + 3).map(image => `\n{{{row\n![${image.id}](${image})\n}}}`).join('');
            imageRows.push(`{{{col${imageCols}\n}}}`);
        }
        imageTags = imageRows.join('\n');
        aiMessage.innerHTML += `<div class='protyle-wysiwyg protyle-wysiwyg--attr images'> ${lute.Md2BlockDOM(imageTags)}</div>`
        aiMessage.querySelector('.protyle-wysiwyg.protyle-wysiwyg--attr.image')
    }
    aiMessage.innerHTML += `<div class='protyle-wysiwyg protyle-wysiwyg--attr'><strong>${doll.ghost.persona.name}:</strong> ${lute.Md2BlockDOM(message.content)}</div>`;
    aiMessage.querySelectorAll('[contenteditable="true"]').forEach(elem => elem.contentEditable = false);
    aiMessage.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('text/html', aiMessage.innerHTML);
    });


    renderLinkMap(aiMessage,linkMap)
    return aiMessage;
}
function getLuteInstance(){
    return plugin.lute||window.Lute.New()
}