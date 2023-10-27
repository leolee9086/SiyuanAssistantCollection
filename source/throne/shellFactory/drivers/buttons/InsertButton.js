import { pluginInstance as plugin, clientApi, pluginInstance } from '../../../../asyncModules.js';
import { EventEmitter } from '../../../../eventsManager/EventEmitter.js';
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
        let detail = { event, message: this.currentAiReply, userInput: this.userInput, doll: this.doll, button: this.button }
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


/*editorElement.addEventListener("drop", async (event: DragEvent & { target: HTMLElement }) => {
    if (protyle.disabled || event.dataTransfer.getData(Constants.SIYUAN_DROP_EDITOR)) {
        // 只读模式/编辑器内选中文字拖拽
        event.preventDefault();
        event.stopPropagation();
        return;
    }
    let gutterType = "";
    for (const item of event.dataTransfer.items) {
        if (item.type.startsWith(Constants.SIYUAN_DROP_GUTTER)) {
            gutterType = item.type;
        }
    }
    const targetElement = (gutterType.startsWith(`application/siyuan-gutternodeattributeview${Constants.ZWSP}col`) ? hasClosestByClassName(event.target, "av__cell") : hasClosestByClassName(event.target, "av__row")) ||
        hasClosestBlock(event.target);
    if (gutterType) {
        // gutter 或反链面板拖拽
        const sourceElements: Element[] = [];
        const gutterTypes = gutterType.replace(Constants.SIYUAN_DROP_GUTTER, "").split(Constants.ZWSP);
        const selectedIds = gutterTypes[2].split(",");
        if (event.altKey) {
            focusByRange(getRangeByPoint(event.clientX, event.clientY));
            let html = "";
            for (let i = 0; i < selectedIds.length; i++) {
                const response = await fetchSyncPost("/api/block/getRefText", {id: selectedIds[i]});
                html += `((${selectedIds[i]} '${response.data}')) `;
            }
            insertHTML(html, protyle);
        } else if (event.shiftKey) {
            focusByRange(getRangeByPoint(event.clientX, event.clientY));
            let html = "";
            selectedIds.forEach(item => {
                html += `{{select * from blocks where id='${item}'}}\n`;
            });
            insertHTML(protyle.lute.SpinBlockDOM(html), protyle, true);
            blockRender(protyle, protyle.wysiwyg.element);
        } else if (targetElement && targetElement.className.indexOf("dragover__") > -1) {
            let queryClass = "";
            selectedIds.forEach(item => {
                queryClass += `[data-node-id="${item}"],`;
            });
            if (window.siyuan.dragElement) {
                window.siyuan.dragElement.querySelectorAll(queryClass.substring(0, queryClass.length - 1)).forEach(elementItem => {
                    if (elementItem.getAttribute("data-type") === "NodeBlockQueryEmbed" ||
                        !hasClosestByAttribute(elementItem, "data-type", "NodeBlockQueryEmbed")) {
                        sourceElements.push(elementItem);
                    }
                });
            } else {    // 跨窗口拖拽
                const targetProtyleElement = document.createElement("template");
                targetProtyleElement.innerHTML = `<div>${event.dataTransfer.getData(gutterType)}</div>`;
                targetProtyleElement.content.querySelectorAll(queryClass.substring(0, queryClass.length - 1)).forEach(elementItem => {
                    if (elementItem.getAttribute("data-type") === "NodeBlockQueryEmbed" ||
                        !hasClosestByAttribute(elementItem, "data-type", "NodeBlockQueryEmbed")) {
                        sourceElements.push(elementItem);
                    }
                });

            }

            const sourceIds: string [] = [];
            sourceElements.forEach(item => {
                item.classList.remove("protyle-wysiwyg--select", "protyle-wysiwyg--hl");
                item.removeAttribute("select-start");
                item.removeAttribute("select-end");
                // 反链提及有高亮，如果拖拽到正文的话，应移除
                item.querySelectorAll('[data-type="search-mark"]').forEach(markItem => {
                    markItem.outerHTML = markItem.innerHTML;
                });
                sourceIds.push(item.getAttribute("data-node-id"));
            });

            hideElements(["gutter"], protyle);
            if (targetElement.classList.contains("av__cell")) {
                const blockElement = hasClosestBlock(targetElement);
                if (!blockElement) {
                    return;
                }
                const avID = blockElement.getAttribute("data-av-id");
                transaction(protyle, [{
                    action: "sortAttrViewCol",
                    avID,
                    previousID: (targetElement.classList.contains("dragover__left") ? targetElement.previousElementSibling?.getAttribute("data-col-id") : targetElement.getAttribute("data-col-id")) || "",
                    id: gutterTypes[2],
                }], [{
                    action: "sortAttrViewCol",
                    avID,
                    previousID: targetElement.parentElement.querySelector(`[data-col-id="${gutterTypes[2]}"`).previousElementSibling?.getAttribute("data-col-id") || "",
                    id: gutterTypes[2],
                }]);
                return;
            }
            if (targetElement.classList.contains("av__row")) {
                // 拖拽到属性视图内
                const blockElement = hasClosestBlock(targetElement);
                if (!blockElement) {
                    return;
                }
                let previousID = "";
                if (targetElement.classList.contains("dragover__bottom")) {
                    previousID = targetElement.getAttribute("data-id") || "";
                } else {
                    previousID = targetElement.previousElementSibling?.getAttribute("data-id") || "";
                }
                const avID = blockElement.getAttribute("data-av-id");
                if (gutterTypes[0] === "nodeattributeview" && gutterTypes[1] === "row") {
                    // 行内拖拽
                    const doOperations: IOperation[] = [];
                    const undoOperations: IOperation[] = [];
                    const undoPreviousId = blockElement.querySelector(`[data-id="${selectedIds[0]}"]`).previousElementSibling.getAttribute("data-id") || "";
                    selectedIds.reverse().forEach(item => {
                        doOperations.push({
                            action: "sortAttrViewRow",
                            avID,
                            previousID,
                            id: item,
                        });
                        undoOperations.push({
                            action: "sortAttrViewRow",
                            avID,
                            previousID: undoPreviousId,
                            id: item,
                        });
                    });
                    transaction(protyle, doOperations, undoOperations);
                } else {
                    transaction(protyle, [{
                        action: "insertAttrViewBlock",
                        avID,
                        previousID,
                        srcIDs: sourceIds,
                    }], [{
                        action: "removeAttrViewBlock",
                        srcIDs: sourceIds,
                        avID,
                    }]);
                }
                return;
            }
            const targetClass = targetElement.className.split(" ");
            targetElement.classList.remove("dragover__bottom", "dragover__top", "dragover__left", "dragover__right", "protyle-wysiwyg--select");
            if (targetElement.parentElement.getAttribute("data-type") === "NodeSuperBlock" &&
                targetElement.parentElement.getAttribute("data-sb-layout") === "col") {
                if (targetClass.includes("dragover__left") || targetClass.includes("dragover__right")) {
                    dragSame(protyle, sourceElements, targetElement, targetClass.includes("dragover__right"), event.ctrlKey);
                } else {
                    dragSb(protyle, sourceElements, targetElement, targetClass.includes("dragover__bottom"), "row", event.ctrlKey);
                }
            } else {
                if (targetClass.includes("dragover__left") || targetClass.includes("dragover__right")) {
                    dragSb(protyle, sourceElements, targetElement, targetClass.includes("dragover__right"), "col", event.ctrlKey);
                } else {
                    dragSame(protyle, sourceElements, targetElement, targetClass.includes("dragover__bottom"), event.ctrlKey);
                }
            }
            // 超级块内嵌入块无面包屑，需重新渲染 https://github.com/siyuan-note/siyuan/issues/7574
            sourceElements.forEach(item => {
                if (item.getAttribute("data-type") === "NodeBlockQueryEmbed") {
                    item.removeAttribute("data-render");
                    blockRender(protyle, item);
                }
            });
            if (targetElement.getAttribute("data-type") === "NodeBlockQueryEmbed") {
                targetElement.removeAttribute("data-render");
                blockRender(protyle, targetElement);
            }
        }
    } else if (event.dataTransfer.getData(Constants.SIYUAN_DROP_FILE)?.split("-").length > 1
        && targetElement && !protyle.options.backlinkData) {
        // 文件树拖拽
        const scrollTop = protyle.contentElement.scrollTop;
        const ids = event.dataTransfer.getData(Constants.SIYUAN_DROP_FILE).split(",");
        if (targetElement.classList.contains("av__row")) {
            // 拖拽到属性视图内
            const blockElement = hasClosestBlock(targetElement);
            if (!blockElement) {
                return;
            }
            let previousID = "";
            if (targetElement.classList.contains("dragover__bottom")) {
                previousID = targetElement.getAttribute("data-id") || "";
            } else {
                previousID = targetElement.previousElementSibling?.getAttribute("data-id") || "";
            }
            const avID = blockElement.getAttribute("data-av-id");
            transaction(protyle, [{
                action: "insertAttrViewBlock",
                avID,
                previousID,
                srcIDs: ids,
            }], [{
                action: "removeAttrViewBlock",
                srcIDs: ids,
                avID,
            }]);
            return;
        }
        for (let i = 0; i < ids.length; i++) {
            if (ids[i]) {
                await fetchSyncPost("/api/filetree/doc2Heading", {
                    srcID: ids[i],
                    after: targetElement.classList.contains("dragover__bottom"),
                    targetID: targetElement.getAttribute("data-node-id"),
                });
            }
        }
        fetchPost("/api/filetree/getDoc", {
            id: protyle.block.id,
            size: window.siyuan.config.editor.dynamicLoadBlocks,
        }, getResponse => {
            onGet({data: getResponse, protyle});
            /// #if !MOBILE
            // 文档标题互转后，需更新大纲
            updatePanelByEditor({
                protyle,
                focus: false,
                pushBackStack: false,
                reload: true,
                resize: false,
            });
            /// #endif
            // 文档标题互转后，编辑区会跳转到开头 https://github.com/siyuan-note/siyuan/issues/2939
            setTimeout(() => {
                protyle.contentElement.scrollTop = scrollTop;
                protyle.scroll.lastScrollTop = scrollTop - 1;
            }, Constants.TIMEOUT_LOAD);
        });
        targetElement.classList.remove("dragover__bottom", "dragover__top");
    } else if (!window.siyuan.dragElement && (event.dataTransfer.types[0] === "Files" || event.dataTransfer.types.includes("text/html"))) {
        // 外部文件拖入编辑器中或者编辑器内选中文字拖拽
        focusByRange(getRangeByPoint(event.clientX, event.clientY));
        if (event.dataTransfer.types[0] === "Files" && !isBrowser()) {
            const files: string[] = [];
            for (let i = 0; i < event.dataTransfer.files.length; i++) {
                files.push(event.dataTransfer.files[i].path);
            }
            uploadLocalFiles(files, protyle, !event.altKey);
        } else {
            paste(protyle, event);
        }
    }
    if (window.siyuan.dragElement) {
        window.siyuan.dragElement.style.opacity = "";
        window.siyuan.dragElement = undefined;
    }
});
*/