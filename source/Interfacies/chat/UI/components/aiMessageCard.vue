<template>
    <div class="ai-message ai-message-card" data-message-id="${message.id}" draggable="true">
        <div class="user-message-header fn__flex">
            <div class="fn__space fn__flex-1"></div>
            <span class="sac-user-name">paimon</span>
            <span class="user-avatar b3-tooltips b3-tooltips__nw block__icon block__icon--show" alt="User's avatar">
                <svg class="b3-tooltips b3-tooltips__nw block__icon block__icon--show">
                    <use xlink:href="#iconAccount">
                    </use>
                </svg>
            </span>

        </div>
        <div>
            <div style="color:black">
                {{ message.content }}
            </div>
            <button class="b3-button size__small">
                tips1
            </button>
            <span class="fn__space">
            </span>
            <button class="b3-button size__small">
                tips2
            </button>
        </div>
        <div class="fn__flex  sac-ai-actions-buttons">
            <div class="fn__space fn__flex-1"></div>
            <div class="fn__flex">
                <span class="
                b3-tooltips 
                b3-tooltips__nw 
                block__icon 
                block__icon--show" aria-label="从此处开始重新生成">
                    <svg>
                        <use xlink:href="#iconRefresh"></use>
                    </svg>
                </span>
                <span 
                @click.prevent="复制消息内容"
                class="
                b3-tooltips 
                b3-tooltips__nw 
                block__icon 
                block__icon--show" aria-label="复制消息内容">
                    <svg>
                        <use xlink:href="#iconCopy"></use>
                    </svg>
                </span>
                <span class="
                b3-tooltips 
                b3-tooltips__nw 
                block__icon 
                block__icon--show" aria-label="修改消息内容">
                    <svg>
                        <use xlink:href="#iconEdit"></use>
                    </svg>
                </span>
                <span 
                class="
                b3-tooltips 
                b3-tooltips__nw 
                block__icon 
                block__icon--show" aria-label="喜欢AI的回答">
                    <svg>
                        <use xlink:href="#iconLike"></use>
                    </svg>
                </span>
                <span 
                class="b3-tooltips 
                b3-tooltips__nw 
                block__icon 
                block__icon--show" 
                aria-label="不喜欢AI的回答">
                    <svg>
                        <use xlink:href="#iconLike" transform="scale(1, -1) translate(0, -14)"></use>
                    </svg>
                </span>
            </div>
        </div>
    </div>
</template>
<script setup>
import { defineProps } from 'vue'
const { message } = defineProps(['message'])
const 复制消息内容 = () => {
  navigator.clipboard.writeText(message.content)
}
</script>
<style>
.sac-tips-buttons {
    padding: 4px
}

.b3-button.size__small {
    font-size: xx-small;
    padding: 4px;
    line-height: 16px;
}

.sac-ai-actions-buttons {
    align-items: flex-end;
}
</style>