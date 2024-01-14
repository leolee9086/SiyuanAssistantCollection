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
            <button id="submit-btn" class="ai-submit-btn">{{ sac.i18n.提交 }}</button>
        </div>
    </div>
</template>
<script setup>
import { sac } from '../../../../asyncModules.js';
import userMessageCard from './userMessageCard.vue';
import aiMessageCard from './aiMessageCard.vue';
</script>