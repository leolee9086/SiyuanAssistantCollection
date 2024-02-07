<template>
    <div class="fn__flex-1 fn__flex-column chat-container">
        <div class="message-container fn__flex-1 fn__flex-column">
            <template v-for="message in messages">
                <component :is="message.role==='assistant'?aiMessageCard:userMessageCard" :message="message"></component>
            </template>
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
const error = ref('')
const inputter = ref(null)
const statusMessage=ref(null)
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
const postMessage = async () => {
    error.value = ''
    statusMessage.value="正在发送中,请稍候"
    try {
        messages.push(buildMessage('user', inputter.value.value))
        
        let res = await postChatMessage({ model: 'zhipu-chatglm-pro', messages })
        statusMessage.value = "正在生成中,请稍候"
        let {message}=res.choices[0]
        messages.push(buildMessage(message.role,message.content))
        statusMessage.value =""
    } catch (e) {
        sac.logger.error(e)
        statusMessage.value=""
        error.value = e
    }
}
</script>