<template>
        <div class="fn__flex-column">
            <div class="b3-card" style="min-height: 70px;">
                <div class="b3-card-body fn__flex-1">
                    <div class="fn__flex fn__margin-large ">
                        <div @click="addSession" class="avatar-image-round-mid">
                            <svg style="color:beige;max-width:60%;max-height: 60%;position: relative;top: 20%;left: 20%;">
                                <use xlink:href="#iconAdd">
                                </use>
                            </svg>
                        </div>
                        <div class="fn__space"></div>
                        <div class="block__icons-text-large fn__align-vertical-center">
                            创建AI对话
                        </div>
                        <div class="fn__space fn__flex-1"></div>
                        <div class="fn__align-vertical-center">
                            <svg class="block__logoicon">
                                <use xlink:href="#iconRight"></use>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cc__divider__vertical surface-lighter"></div>
            <div class="fn__flex-1 ">
                <div class="fn__flex-column">
                <template v-for="chat in chatSessions">
                    <div class="b3-card b3-card-margin-mini">
                        <div class="b3-card-body fn__flex-1">
                            <div class="fn__flex fn__margin-large ">
                                <div class="avatar-image-round-mid">
                                    <img src="https://img.jkbaby.cn/uploadimg/image/20210817/20210817151800_24414.jpg" />

                                </div>
                                <div class="fn__space"></div>
                                <div class="block__icons-text-medium fn__align-vertical-center">
                                    <div>
                                        测试AI名称
                                    </div>
                                    <div class="text-light">
                                        测试AI简介
                                    </div>
                                </div>
                                <div class="fn__space fn__flex-1"></div>
                                <div class="fn__align-vertical-center">
                                    <svg class="block__logoicon">
                                        <use xlink:href="#iconRight"></use>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            </div>
        </div>
</template>
<script setup>
import { ref } from 'vue'
const chatSessions = ref([{ 测试: '测试' }])
const addSession = () => {
    chatSessions.value.push({
        测试: "测试"
    })
}
</script>
<style scoped>
.b3-card-margin-mini {
    margin-top: 0%;
}

.text-light {
    color: var(--b3-theme-on-surface)
}

.fn__space-40px {
    min-width: 40px
}

.fn__space-36px {
    min-width: 36px
}

.fn__space-28px {
    min-width: 28px
}

.block__icons-text-large {
    font-size: large;
    font-weight: 800;
}

.block__icons-text-medium {
    font-size: medium;
    font-weight: 800;

}

.fn__margin-large {
    margin: 5px;
    padding: 5px;
}

.avatar-image-round-mid {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    background-image: linear-gradient(75.25643716352927deg, #D12323 0%, #c9321b 16%, #B84028 21%, #9D0B1B 100%);
    overflow: hidden;
}

.fn__align-vertical-center {
    align-self: center;
}
</style>