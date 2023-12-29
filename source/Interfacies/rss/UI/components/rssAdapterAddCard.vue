<template>
    <div class="fn__flex-1 fn__flex b3-card b3-card--wrap sac-rss-card">
        <div class="b3-card__actions b3-card__actions--right">
            <span @click="从网页解析集市源" class="block__icon block__icon--show ariaLabel" aria-label="从网页解析集市源">
                <svg style="width:30px;height:30px;">
                    <use xlink:href="#iconHTML5"></use>
                </svg>
            </span>
            <span class="block__icon block__icon--show ariaLabel" aria-label="从json文件解析集市源">
                <svg style="width:30px;height:30px;">
                    <use xlink:href="#iconFile"></use>
                </svg>
            </span>
        </div>
    </div>
</template>
<script setup>
import {sac} from "runtime"
const 从网页解析集市源 = () => {
    sac.eventBus.emit('rss-ui-open-dialog',
        {
            type: 'addAdapter',
            source: "HTML"
        }
    )
}
</script>