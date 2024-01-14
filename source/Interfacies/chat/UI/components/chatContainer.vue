<template>
    <div class="fn__flex-1 fn__flex-column chat-container">
        <div class="message-container fn__flex-1 fn__flex-column">
            <userMessageCard></userMessageCard>

            <aiMessageCard></aiMessageCard>
        </div>
        <div class='user-input-container'>
            <button class="ai-quote-btn">
                <svg>
                    <use xlink:href="#iconList"></use>
                </svg>
            </button>
            <textarea id="user-input" placeholder="请输入内容"></textarea>
            <button id="submit-btn" class="ai-submit-btn" @click="postMessage">{{ sac.i18n.提交 }}</button>
        </div>
    </div>
</template>
<script setup>
import { sac } from '../../../../asyncModules.js';
import userMessageCard from './userMessageCard.vue';
import aiMessageCard from './aiMessageCard.vue';
import { completeHistory } from '../utils/session.js';
const postMessage = async()=>{
    let res =  await sac.路由管理器.internalFetch('/ai/v1/chat/completions',{
        method:"POST",
        body:{
            model: 'zhipu-chatglm_turbo',
            messages: [{role:"user",content:"你是谁"}],
        }
    })
    sac.logger.log(res.body)
    return await res.body.data
}
</script>