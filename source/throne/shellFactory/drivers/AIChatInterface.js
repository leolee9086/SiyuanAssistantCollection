import { EventEmitter } from '../../../eventsManager/EventEmitter.js';
import { pluginInstance as plugin } from '../../../asyncModules.js';
import { aiMessageButton } from './buttons/InsertButton.js';
export class AIChatInterface extends EventEmitter {
    constructor(element, doll) {
        super(`textChat_${doll.ghost.persona.name}`)
        this.doll = doll
        this.initUI(element)
        this.describe = {
            showHistory: '显示所有之前的聊天记录',
        }
        this.初始化事件监听器()
        this.当前参考内容组 = []
        this.当前用户输入 = ''
        this.当前AI回复 = ''
        this.lute = plugin.lute

    }
    初始化事件监听器() {
        this.on(
            'textWithRole',
            (event) => {
                let 消息对象 = event.detail
                if (!消息对象.id) {
                    throw new Error('消息没有ID,请检查')
                }
                this.显示消息(消息对象)
            }
        )
        this.提交按钮.addEventListener("click", async (event) => {
            let 用户输入文字 = this.用户输入框.value
            if (用户输入文字) {
                this.当前用户输入 = 用户输入文字
                this.用户输入框.value = ""
                this.提交用户消息(this.当前用户输入)
                this.等待AI回复()
                event.stopPropagation(); 
            
            }
        });

        this.用户输入框.addEventListener("keydown", (event) => {
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
        });
        this.引用按钮.addEventListener('click', () => {
            // 在这里添加点击按钮时的操作
            // 例如，你可以插入一个引用到 userInputInput 中：
            let 参考内容 = this.当前参考内容组
            this.emit('quoteButtonClicked', { refs: 参考内容, userInput: this.当前用户输入, doll: this.doll, button: this.引用按钮 })
            if (!参考内容 instanceof Array) {
                参考内容 = []
            }
            document.querySelectorAll(".protyle-wysiwyg--select").forEach(el => {
                console.log(plugin.lute)
                参考内容.push(`[${el.textContent.substring(0, 512)}](siyuan://blocks/${el.getAttribute('data-node-id')})`)
            })
            参考内容[0] ? this.用户输入框.value += `\n> ---references---\n${参考内容.join('\n')}` : null

        });
    }
    提交用户消息(消息文字){
        this.emit(`Ai_shell_${this.shell.name}_textChat_userMessage`,消息文字)
    }
    setlute(lute) {
        this.aiChatUI.lute = lute
    }
    initUI(element) {
        const 聊天容器 = document.createElement('div');
        聊天容器.id = 'chat-container';
        聊天容器.setAttribute('class', 'fn__flex-1')

        const 引用按钮 = document.createElement('button');
        引用按钮.textContent = '插入引用';
        引用按钮.classList.add('ai-quote-btn')
        
        const 用户输入框 = document.createElement('textarea');
        用户输入框.id = 'user-input';
        用户输入框.placeholder = '请输入内容';

        const 提交按钮 = document.createElement('button');
        提交按钮.id = 'submit-btn';
        提交按钮.classList.add('ai-submit-btn')
        提交按钮.textContent = '提交';

        const 用户输入区 = document.createElement('div');
        用户输入区.classList.add('user-input-container');
        用户输入区.appendChild(引用按钮);  // 将按钮添加到 userInputContainer 中
        用户输入区.appendChild(用户输入框);
        用户输入区.appendChild(提交按钮);
        const 对话框容器 = document.createElement('div');
        对话框容器.classList.add('dialog-container');
        对话框容器.appendChild(用户输入区);

        const 对话框内容元素 = document.createElement('div');
        对话框内容元素.classList.add('b3-dialog__content', 'fn__flex-column', 'ai-dialog');
        对话框内容元素.appendChild(聊天容器);
        对话框内容元素.appendChild(对话框容器);

        用户输入区.appendChild(提交按钮);
        this.提交按钮 = 提交按钮;
        this.用户输入框 = 用户输入框;
        this.聊天容器 = 聊天容器;
        this.引用按钮 = 引用按钮

        console.log(this.doll)
        element.appendChild(对话框内容元素);
        用户输入框.focus()

    }

    显示消息(message) {
        console.log(message)
        switch (message.role) {
            case "user":
                this.显示用户消息(message.content)
                break
            case 'assistant':
                this.添加AI消息(message.content)
                break
        }
        
        this.聊天容器.scrollTop = this.聊天容器.scrollHeight;
    }

    处理消息(AI消息元素, message) {
        AI消息元素.innerHTML = `<div class='protyle-wysiwyg protyle-wysiwyg--attr'><strong>AI:</strong> ${this.lute ? this.lute.Md2BlockDOM(message) : message}</div>`;
        AI消息元素.querySelectorAll('[contenteditable="true"]').forEach(elem => elem.contentEditable = false);
        this.添加插入按钮(AI消息元素, this.当前用户输入);
    }
    添加插入按钮(aiMessage, userInput) {
        let button = new aiMessageButton({ doll: this.doll, aiMessage, currentAiReply: this.当前AI回复, userInput });
        aiMessage.appendChild(button.button);
    }
    显示用户消息(message) {
        const userMessage = createElement("div", ["user-message"], `<strong>User:</strong> ${message}`);
        this.聊天容器.appendChild(userMessage);
    }

    更新AI消息(aiMessage, newMessage) {
        aiMessage.innerHTML = `<div class='protyle-wysiwyg protyle-wysiwyg--attr'><strong>AI:</strong> ${this.lute ? this.lute.Md2BlockDOM(newMessage) : newMessage}</div>`;
        aiMessage.querySelectorAll('[contenteditable="true"]').forEach(elem => elem.contentEditable = false);
        aiMessage.addEventListener('click', function (event) {
            const target = event.target;
            if (target.tagName === 'SPAN' && target.hasAttribute('data-href')) {
                const href = target.getAttribute('data-href');
                window.open(href, '_blank');
            }
        });
        this.添加插入按钮(aiMessage, this.当前用户输入);
        this.用户输入框.removeAttribute('disabled')
    }
    添加AI消息(message) {
        const aiMessage = createElement("div", ["ai-message"], "");
        this.处理消息(aiMessage, message);
        this.聊天容器.appendChild(aiMessage);
        this.用户输入框.removeAttribute('disabled')
        return aiMessage;
    }
    等待AI回复() {
        this.用户输入框.setAttribute('disabled', true)
    }
}
function createElement(tagName, classNames, innerHTML) {
    const element = document.createElement(tagName);
    element.classList.add(...classNames);
    element.innerHTML = innerHTML;
    return element;
}
