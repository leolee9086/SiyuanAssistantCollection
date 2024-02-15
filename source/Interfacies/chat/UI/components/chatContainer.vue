<template>
    <div class="fn__flex-1 fn__flex-column chat-container">
        <div class="message-container fn__flex-1 fn__flex-column">
            <template v-for="message in messages">
                <component :is="message.role==='assistant'?aiMessageCard:userMessageCard" :message="message"></component>
            </template>
            <div v-if="seggestions.length > 0">
                <div class="user-message user-message-card fn__flex" v-for="(suggestion, index) in seggestions" :key="index" @click="addSuggestionToInput(suggestion)">{{
                    suggestion }}</div>
            </div>
        </div>
        <div v-if="error">{{ error }}</div>
        <div v-if="statusMessage">{{ statusMessage }}</div>

        <div class='user-input-container'>
            <button class="ai-quote-btn">
                <svg>
                    <use xlink:href="#iconList"></use>
                </svg>
            </button>
            <textarea ref="inputter" id="user-input" placeholder="请输入内容"></textarea>
            <button id="submit-btn" class="ai-submit-btn" @click="postMessage">{{ sac.i18n.提交 }}</button>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { sac } from '../../../../asyncModules.js';
import userMessageCard from './userMessageCard.vue';
import aiMessageCard from './aiMessageCard.vue';
import { postChatMessage } from '../../../../Processors/AIProcessors/publicUtils/endpoints.js'
import { completeHistory } from '../utils/session.js';
const messages = reactive([])
const seggestions = reactive([])
const error = ref('')
const inputter = ref(null)
const statusMessage = ref(null)
let buildMessage = (role, content) => {
    return {
        role,
        content,
        id: Lute.NewNodeID(),
        timestamp: new Date().toISOString(), // ISO string of the current date and time,
        neighbors: { previous: [], next: [] },
        vector: {}
    }
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

        let res = await postChatMessage({ model: 'zhipu-chatglm-pro', messages })
        statusMessage.value = "正在生成中,请稍候"
        let { message } = res.choices[0]
        messages.push(buildMessage(message.role, message.content))
        statusMessage.value = ""
        await getPromptSuggestions()
    } catch (e) {
        sac.logger.error(e)
        statusMessage.value = ""
        error.value = e
    }
}
const getPromptSuggestions = async () => {
    try {
        const promptSuggestionsPrompt = [{
            role: "system",
            content: `你是一个AI对话提示词助手,你的工作是根据给出的对话内容,为用户推荐合适的提问,这有些类似输入法的智能输入提示,这些提示需要满足这些要求:
            问题应该与历史对话紧密相关,有助于进一步的讨论;
            问题不应该出现在历史对话中,也不应该与历史对话中的内容过于近似.
            问题应该以用户的口吻提出,用于触发AI的回复,而不是相反.
            你的回复的每一行包含且仅包含一个问题,**不需要**任何编号等额外内容,只需要简单分行即可
            除了问题之外,禁止输入任何多余内容
            除了问题之外,**禁止**包含任何类似"你可以使用以下建议"、"你可以尝试以下话题"等内容
            必须以尽可能简洁的语言，模仿用户的口吻，直接给出可以**直接被用户用于与AI对话**的提示内容,而不是尝试告诉用户如何提问的技巧
                正确示例:"你能够帮我做什么?"
                正确示例:"你能帮我写一段程序吗?"
                错误示例:"你可以询问AI它有哪些能力"
                错误示例:"你可以询问AI它能否帮助你编写程序"
                错误示例:"1.你能帮我编写一段程序吗?"
            给出三到五个最合适的问题
            以上各要求对于正确完成你的任务极其重要，你必须要完全地、始终地、最高优先级地遵守
            尤其必须注意，**不要**输出任何多余的内容
            `
        }, {
            role: "system",
            content: `以下是历史对话:
            ${messages.slice(-5).map(item => { return `${item.role}:${item.content}` }).join('\n')}            `
        }, {
            role: "user",
            content: "请根据历史对话，按要求列举三到五个合适的问题,**不要**对问题编号,不要重复提问"
        }]
        let res = await postChatMessage({ model: 'zhipu-chatglm-pro', messages: promptSuggestionsPrompt })
        let { message } = res.choices[0]
        message.content.split('\n').forEach(
            question => seggestions.push(question.replace(/^\d+\./, ''))
        )
    } catch (e) {
        sac.logger.error(e);
        error.value = e;
    }
}
</script>