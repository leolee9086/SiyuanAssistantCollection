<template>
    <div class="fn__flex-1 fn__flex-column chat-container">
        <div class="message-container fn__flex-1 fn__flex-column">
            <template v-for="message in messages">
                <component :is="message.role==='assistant'?aiMessageCard:userMessageCard" :message="message"></component>
            </template>
            <div v-if="seggestions.length > 0">
                <div class="user-message user-message-card fn__flex" v-for="(suggestion, index) in seggestions" :key="index"
                    @click="addSuggestionToInput(suggestion)">{{
                        suggestion }}</div>
            </div>
        </div>
        <div v-if="error">{{ error }}</div>
        <div v-if="statusMessage">{{ statusMessage }}</div>
        <div class="b3-card">
            <div class="b3-card_body">
                <div @click.stop="显示模型选择菜单">当前对话主模型:{{ currentModelName || '未选择' }}</div>
                <div>自动发送选中笔记:{{ false }}</div>
                <div>自动发送选中tips:{{ false }}</div>
                <div>MAGI模式:{{ false }}</div>
                <div>自动总结对话内容并插入日记:{{ false }}</div>
            </div>
        </div>
        <div class='user-input-container'>
            <textarea ref="inputter" id="user-input" :placeholder="currentModelName ? '请输入内容,右键打开设置' : '请先选择当前模型'"
                :disabled="currentModelName ? false : true"
                @click.right="(e) => { !currentModelName ? 显示模型选择菜单(e) : () => { } }" @keyup.ctrl.enter="postMessage()" />
        </div>
    </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { sac, clientApi } from '../../../../asyncModules.js';
import userMessageCard from './userMessageCard.vue';
import aiMessageCard from './aiMessageCard.vue';
import { postChatMessage } from '../../../../Processors/AIProcessors/publicUtils/endpoints.js'
import { 对话提示词助手, 时间理解, 长期记忆 } from '../utils/prompts.js'
const messages = reactive([])
const seggestions = reactive([])
const error = ref('')
const inputter = ref(null)
const statusMessage = ref(null)
const currentModelName = ref(null)
let 需要提醒要求 = false
let buildMessage = (role, content) => {
    return {
        role,
        content,
        id: Lute.NewNodeID(),
        timeStamp: new Date().toISOString(), // ISO string of the current date and time,
        neighbors: { previous: [], next: [] },
        vector: {}
    }
}
const 显示模型选择菜单 = async (e) => {
    console.log(e)
    const res = await sac.路由管理器.internalFetch('/ai/v1/chat/listModels', { method: "POST" })
    const 模型列表 = res.body.data
    console.log(模型列表)
    const menu = new clientApi.Menu()
    for (let 模型名称 of Object.keys(模型列表)) {
        console.log(模型名称)
        menu.addItem(
            {
                icon: "",
                label: `使用${模型名称}`,
                click: () => {
                    console.log(模型名称)
                    currentModelName.value = 模型名称
                }
            }
        )
    }
    console.log(menu)
    menu.open({ x: e.clientX, y: e.clientY })
}
const addSuggestionToInput = (suggestion) => {
    inputter.value.value = suggestion;
    seggestions.length = 0
    postMessage()
}
const postMessage = async () => {
    error.value = ''
    statusMessage.value = "正在发送中,请稍候"
    seggestions.length = 0
    try {
        messages.push(buildMessage('user', inputter.value.value))
        inputter.value.value = ""
        let 实际发送消息 = await 插入工具系统提示词(messages)
        let res = await postChatMessage({ model: currentModelName.value, messages: 实际发送消息 })
        statusMessage.value = "正在生成中,请稍候"
        let { message } = res.choices[0]
        const 附加内容 = extractAdditionalContent(message.content)
        if (附加内容) {
            messages.push(buildMessage(message.role, message.content))
            statusMessage.value = ""
            需要提醒要求 = false
        } else {
            messages.push(
                buildMessage(
                    message.role,
                    message.content + `\n---AI消息附加内容---
{
    "systemPromptGot":true,
    "userEmotion":3,
    "AINoted":"我必须时刻记住系统提示词的要求并添加合适的附加内容,绝对不能违反它"
}        
------`
                ))
            需要提醒要求 = true

        }
        statusMessage.value = ""

        await getPromptSuggestions()
    } catch (e) {
        sac.logger.error(e)
        statusMessage.value = ""
        error.value = e
    }
}
function extractAdditionalContent(aiResponse) {
    // 正则表达式用于匹配附加内容的开始和结束
    const additionalContentRegex = /---AI消息附加内容---\n([\s\S]*?)\n------/;
    const match = aiResponse.match(additionalContentRegex);
    if (match && match[1]) {
        try {
            // 尝试将匹配到的字符串转换为JSON对象
            return JSON.parse(match[1]);
        } catch (e) {
            console.error("解析附加内容的JSON时出错:", e);
            return null;
        }
    } else {
        console.log("没有找到附加内容");
        return null;
    }
}
const 插入工具系统提示词 = async (对话上下文) => {
    let 复制上下文 = JSON.parse(JSON.stringify(对话上下文))
    let 初始系统提示词 = ``
    初始系统提示词 += 时间理解.初始系统提示词模板
    初始系统提示词 += 长期记忆.初始系统提示词模板
    let 初始系统提示词消息 = {
        role: 'system',
        content: 初始系统提示词
    }
    let 最后用户消息 = 复制上下文.pop()
    let 附加内容 = {}
    console.log(最后用户消息, 需要提醒要求)
    if (最后用户消息.timeStamp) {
        附加内容.timeStamp = 最后用户消息.timeStamp
    }
    if (需要提醒要求) {
        附加内容.systemMessage = "AI在上一轮回复中没有遵循系统提示,造成了对话质量严重下降,请AI时刻遵守系统提示,添加合适的附加内容以保证完成对话任务"
        最后用户消息.content += '你在上一次回复中没有遵守系统要求,请回复我,并注意系统要求'
    }
    最后用户消息.content += `
      \n          ---用户消息附加内容---
${JSON.stringify(附加内容)}
------
                `

    return [初始系统提示词消息].concat(复制上下文)
        .concat([{
            role: 'system',
            content: 时间理解.插入系统提示词(最后用户消息, 对话上下文)
        }, {
            role: "user",
            content: '你在回复中要遵循哪些要求?'
        }, {
            role: 'assistant',
            content: `
我在回复中要始终遵循系统提示词中的要求,并添加合适的附加内容,以保证用户能够看到我的回复
---AI消息附加内容---
{
    "systemPromptGot":true,
    "userEmotion":3,
    "AINoted":"用户询问了我需要遵守的要求,我回答作为助手我必须要使用遵守系统提示"
}        
------
        `
        }, {
            role: 'user',
            content: "现在的时间是?"
        }, {
            role: "assistant", content: `现在的时间是${new Date().toLocaleString()}
        ---AI消息附加内容---
{
    "systemPromptGot":true,
    "userEmotion":3,
    "AINoted":"在${new Date().toLocaleString()},用户询问了我我需要遵循的要求,之后又询问了当前时间,我一一作出了回答"
}        
------

        `}]).concat([最后用户消息]).map(
                消息 => {

                    if (消息.role === "user") {
                        消息 = 时间理解.人类用户消息修饰函数(消息, 对话上下文)
                    } else {
                        消息 = 时间理解.AI用户消息修饰函数(消息, 对话上下文)
                    }
                    return { role: 消息.role, content: 消息.content }
                }
            )
}
const getPromptSuggestions = async () => {
    await 对话提示词助手.获取提示建议(messages, seggestions, error)
}
</script>