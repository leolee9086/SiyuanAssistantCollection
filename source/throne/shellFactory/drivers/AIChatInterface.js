import { EventEmitter } from '../../../eventsManager/EventEmitter.js';
import { clientApi, pluginInstance as plugin, kernelApi } from '../../../asyncModules.js';
import { aiMessageButton } from './AiChatInterface/buttons/aiMessageButton.js';
import { 创建输入菜单按钮 } from './AiChatInterface/buttons/userInputButtonLeft.js';
import { 创建聊天容器 } from './AiChatInterface/chatContainers/index.js'
import { 创建用户输入框 } from './AiChatInterface/userInputArea/index.js';
import { 创建提交按钮 } from './AiChatInterface/buttons/userInputButtonRight.js';
import { 创建用户输入区 } from './AiChatInterface/userInputArea/index.js';
import { show as showGhostSelector } from './menus/ghostSelector.js';
import logger from '../../../logger/index.js'
import { 防抖 } from '../../../utils/functionTools.js';
import { 获取嵌入块内容 } from './renders/index.js';
import BlockHandler from '../../../utils/BlockHandler.js';
import { createElementWithTagname } from '../../../UI/builders/index.js';
export class AIChatInterface extends EventEmitter {
    constructor(element, doll) {
        super(`textChat_${doll.ghost.persona.name}`)
        this.doll = doll
        this.element = element
        this.初始化()
        this.on('refresh', () => { this.初始化.bind(this)() })
    }
    初始化() {
        this.off(
            'textWithRole',
            this.消息显示回调
        )
        this.dispose()
        this.初始化UI(this.element)
        this.container = this.element
        this.初始化事件监听器()
        this.describe = {
            showHistory: '显示所有之前的聊天记录',
        }
        this.当前参考内容组 = []
        this.当前用户输入 = ''
        this.当前AI回复 = ''
        this.临时聊天容器 = document.createDocumentFragment()
        this.messageCache = []
    }
    get lute() {
        return plugin.lute || window.Lute.New()
    }

    dispose() {
        this.container ? this.container.innerHTML = '' : null
    }
    消息显示回调 = (event) => {
        let 消息对象 = event.detail
        if (!消息对象.id) {
            throw new Error('消息没有ID,请检查')
        }
        this.显示消息(消息对象)
    }
    初始化事件监听器() {
        this.on(
            'textWithRole',
            this.消息显示回调
        )
        this.提交按钮.addEventListener("click", this.提交按钮点击回调);
        this.用户输入框.addEventListener("keydown", this.用户输入回调);
        this.引用按钮.addEventListener('click', () => {
            // 在这里添加点击按钮时的操作
            // 例如，你可以插入一个引用到 userInputInput 中：
            showGhostSelector(this.引用按钮, this)
            let 参考内容 = this.当前参考内容组
            this.emit('quoteButtonClicked', { refs: 参考内容, userInput: this.当前用户输入, doll: this.doll, button: this.引用按钮 })
            if (!参考内容 instanceof Array) {
                参考内容 = []
            }
            document.querySelectorAll(".protyle-wysiwyg--select").forEach(el => {
                logger.aiChatlog(plugin.lute)
                参考内容.push(`[${el.textContent.substring(0, 512)}](siyuan://blocks/${el.getAttribute('data-node-id')})`)
            })
            参考内容[0] ? this.用户输入框.value += `\n> ---references---\n${参考内容.join('\n')}` : null
        });
    }
    用户输入回调 = async (event) => {
        if (event.key === "Enter" && !globalThis.siyuan.ctrlIsPressed) {
            this.提交按钮.click(); // 触发提交按钮的 click 事件
            event.preventDefault(); // 阻止默认的换行行为
            event.stopPropagation(); // 阻止事件冒泡
        } else if (event.key === "Tab") {
            event.preventDefault(); // 阻止默认的 Tab 行为
            event.stopPropagation(); // 阻止事件冒泡
            // 获取最后一个"插入按钮"
            const 最后插入按钮 = this.聊天容器.querySelector(".ai-message button:last-child");
            if (最后插入按钮) {
                最后插入按钮.click(); // 触发"插入按钮"的 click 事件
            }
        }
    }
    提交按钮点击回调 = async (event) => {
        event.stopPropagation();
        let 用户输入文字 = this.用户输入框.value
        if (用户输入文字) {
            if (this.用户输入框.value == '/刷新') {
                window.location.reload()//如果用户提交的内容是这样的话刷新界面
                return
            }
            this.当前用户输入 = 用户输入文字
            this.用户输入框.value = ""
            this.提交用户消息(this.当前用户输入)
            this.等待AI回复()
        }
        this.doll.components['textChat'].current = this
    }
    提交用户消息(消息文字) {
        logger.aiChatlog(消息文字)
        this.shell.emit(`textChat_userMessage`, 消息文字)
    }
    初始化UI(element) {
        let that = this
        this.off("waitForReply", that.等待AI回复)
        this.创建聊天容器()
        this.创建用户输入区()
        const 对话框容器 = document.createElement('div');
        对话框容器.classList.add('dialog-container');
        对话框容器.appendChild(this.用户输入区);
        const 对话框内容元素 = document.createElement('div');
        对话框内容元素.classList.add('b3-dialog__content', 'fn__flex-column', 'ai-dialog');
        对话框内容元素.appendChild(this.聊天容器);
        对话框内容元素.appendChild(对话框容器);
        logger.aiChatlog(this.doll)
        element.appendChild(对话框内容元素);
        this.用户输入框.focus()
        this.on("waitForReply", that.等待AI回复)
        this.messageCache = []
    }
    创建聊天容器() {
        const 聊天容器 = 创建聊天容器()
        this.聊天容器 = 聊天容器;
    }
    创建用户输入区() {
        const 输入菜单按钮 = 创建输入菜单按钮()
        this.引用按钮 = 输入菜单按钮

        const 用户输入框 = 创建用户输入框()
        this.用户输入框 = 用户输入框;

        const 提交按钮 = 创建提交按钮()
        this.提交按钮 = 提交按钮;

        const 用户输入区 = 创建用户输入区()
        用户输入区.appendChild(输入菜单按钮);  // 将按钮添加到 userInputContainer 中
        用户输入区.appendChild(用户输入框);
        用户输入区.appendChild(提交按钮);
        this.用户输入区 = 用户输入区
    }
    显示消息(message) {
        this.messageCache.push(message);
        this.处理消息缓存();
    }
    处理消息缓存 = 防抖(() => {
        this.messageCache.forEach(message => {
            switch (message.role) {
                case "user":
                    this.显示用户消息(message, message.id);
                    break;
                case 'assistant':
                    this.添加AI消息(message, message.linkMap, message.images);
                    break;
            }
        });
        this.聊天容器.appendChild(this.临时聊天容器)
        this.聊天容器.scrollTop = this.聊天容器.scrollHeight;
        this.messageCache = [];  // 清空消息缓存
        this.临时聊天容器 = document.createDocumentFragment()
    }, 100)
    显示用户消息(message) {
        let { content, id } = message
        const userMessage = createElementWithTagname("div", ["user-message", "fn__flex"], `<div class="fn__flex"><strong>User:</strong> ${content}</div>`);
        userMessage.appendChild(createElementWithTagname('div', ["fn__space", "fn__flex-1"], ``))
        let trashButton = createElementWithTagname('span', [], `<svg class="b3-menu__icon " style=""><use xlink:href="#iconTrashcan"></use></svg>`)
        userMessage.appendChild(trashButton)
        trashButton.addEventListener('click', () => { this.doll.emit('human-forced-forget-to', id) })
        let refreshButton = createElementWithTagname('span', [], `<svg class="b3-menu__icon " style=""><use xlink:href="#iconRefresh"></use></svg>`)
        userMessage.appendChild(refreshButton)
        refreshButton.addEventListener('click', () => {
            this.doll.emit('human-forced-forget-to', { id: id })
            this.doll.components['textChat'].current = this
            this.提交用户消息(message.content)
        }
        )
        this.临时聊天容器.appendChild(userMessage);
        userMessage.setAttribute('data-message-id', id)
        this.doll.components['textChat'].curren = this
    }
    添加AI消息(message, linkMap, images) {
        const aiMessage = createElementWithTagname("div", ["ai-message"], "");
        aiMessage.setAttribute('data-message-id', message.id)
        this.临时聊天容器.appendChild(aiMessage);
        aiMessage.setAttribute('draggable', "true")
        if (images) {
            let imageTags = ""
            let imageRows = [];
            for (let i = 0; i < images.length; i += 3) {
                let imageCols = images.slice(i, i + 3).map(image => `\n{{{row\n![${image.id}](${image})\n}}}`).join('');
                imageRows.push(`{{{col${imageCols}\n}}}`);
            }
            imageTags = imageRows.join('\n');
            aiMessage.innerHTML += `<div class='protyle-wysiwyg protyle-wysiwyg--attr images'> ${this.lute ? this.lute.Md2BlockDOM(imageTags) : ""}</div>`
            aiMessage.querySelector('.protyle-wysiwyg.protyle-wysiwyg--attr.image')
        }
        aiMessage.innerHTML += `<div class='protyle-wysiwyg protyle-wysiwyg--attr'><strong>${this.doll.ghost.persona.name}:</strong> ${this.lute ? this.lute.Md2BlockDOM(message.content) : message.content}</div>`;
        aiMessage.querySelectorAll('[contenteditable="true"]').forEach(elem => elem.contentEditable = false);
        aiMessage.addEventListener('dragstart', function (event) {
            event.dataTransfer.setData('text/html', aiMessage.innerHTML);
        });
        let linkSpans = aiMessage.querySelectorAll('[data-type="a"]')
        let _linkMap = this.doll.ghost.linkMap;
        (async () => {
            let combinedLinkMap = { ..._linkMap, ...linkMap };
            combinedLinkMap && linkSpans.forEach(link => {
                const idShortCode = link.getAttribute('data-href').replace('ref:', '').split('-').pop().trim();
                const foundLink = Object.keys(combinedLinkMap).find(key => key.endsWith(idShortCode));
                if (foundLink) {
                    link.setAttribute('data-href', combinedLinkMap[foundLink]);
                    link.addEventListener('click', (event) => {
                        const target = event.target;
                        const href = target.getAttribute('data-href');
                        window.open(href, '_blank');

                    });
                } else {
                    if (!link.getAttribute('data-href').startsWith('ref:')) {
                        link.setAttribute('data-real-href', link.getAttribute('data-href'));
                        link.addEventListener('click', (e) => {
                            clientApi.confirm(
                                "这货又自己编参考来源了",
                                '这个链接好像是它自己找的,你要尝试访问的话就点吧',
                                (confirmed) => {
                                    if (confirmed) {
                                        window.open(link.getAttribute('data-real-href', '_blank'))
                                    }
                                }
                            )
                            e.stopPropagation()
                            e.preventDefault()
                        })
                    } else {
                        link.setAttribute('data-real-href', link.getAttribute('data-href'));
                        link.setAttribute('data-href', link.getAttribute('data-href') + "这个肯定是它瞎编的不用想了");
                        link.addEventListener('click', (e) => {
                            clientApi.confirm(
                                "这货又自己编参考来源了",
                                '这个链接好像是它编的,你要尝试访问的话就点吧',
                                (confirmed) => {
                                    if (confirmed) {
                                        window.open(link.getAttribute('data-real-href', '_blank'))
                                    }
                                }
                            )
                            e.stopPropagation()
                            e.preventDefault()
                        })
                    }

                }
            });

        })()
        this.用户输入框.removeAttribute('disabled')
        this.添加插入按钮(aiMessage, this.当前用户输入, message);
        this.embedBlocksContent = ''
        try {
            let blockIDs = []
            aiMessage.querySelectorAll(`[data-type="NodeBlockQueryEmbed"]`).forEach(
                embedBlock => {
                    let 最近文档ID = kernelApi.sql.sync({ stmt: `select * from blocks where type ='d' ORDER BY updated DESC` })
                    embedBlock.innerHTML = 获取嵌入块内容(embedBlock, 最近文档ID[0].id)
                    Array.from(embedBlock.querySelectorAll('[data-node-id]')).forEach(
                        block => {
                            blockIDs.push(block.getAttribute('data-node-id'))
                            this.embedBlocksContent += `\n${(new BlockHandler(block.getAttribute('data-node-id'))).markdown}[from block:${block.getAttribute('data-node-id')}}](siyuan://blocks/${block.getAttribute('data-node-id')})`

                        }
                    )
                }
            )
        } catch (e) {
            console.error(e)
        }
        return aiMessage;
    }
    添加插入按钮(aiMessage, userInput, message) {
        let button = new aiMessageButton({ doll: this.doll, aiMessage, currentAiReply: message, userInput });
        aiMessage.appendChild(button.button);
    }
    等待AI回复 = () => {
        this.用户输入框.setAttribute('disabled', true)
    }
}
