<template>
    <div class="fn__flex-1 fn__flex-column chat-container">
        <div class="message-container fn__flex-1 fn__flex-column">
            <template v-for="message in messages">
                <component :is="message.role==='assistant'?aiMessageCard:userMessageCard" :message="message"></component>
            </template>
            <userMessageCard></userMessageCard>
            <aiMessageCard v-if="message" :message="message"></aiMessageCard>
        </div>
        <div v-if="error">{{ error }}</div>
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
import {ref} from 'vue'
import { sac } from '../../../../asyncModules.js';
import userMessageCard from './userMessageCard.vue';
import aiMessageCard from './aiMessageCard.vue';
import { postChatMessage } from '../../../../Processors/AIProcessors/publicUtils/endpoints.js'
import { completeHistory } from '../utils/session.js';
const messages = ref([])
const message = ref({})
const error  =ref('')
const inputter = ref(null)
let data = {
    model: 'zhipu-chatglm-pro',
    messages: [{ role: "user", content: "你是谁" }],
}
const postMessage = async() => {
    error.value = ''
    try{
    data.content = inputter.value.value
    let res= await postChatMessage(data)
    messages.value.push(res.choices[0].message)
    }catch(e){
        sac.logger.error(e)
        error.value = e
    }
}
</script>