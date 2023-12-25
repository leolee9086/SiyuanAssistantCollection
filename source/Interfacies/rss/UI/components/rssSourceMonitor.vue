<template>
    <div class="fn__flex-1 fn__flex b3-card b3-card--wrap sac-rss-card">
        <div class="b3-card__body fn__flex" style="font-size:small !important;padding:0">
            <div class="b3-card__actions b3-card__actions--right">
                <span class="block__icon block__icon--show ariaLabel" data-rss-adapter-source="github"
                    aria-label="从GitHub添加">
                    <svg>
                        <use xlink:href="#iconGithub"></use>
                    </svg>
                </span>
                <span class="block__icon block__icon--show ariaLabel" aria-label="从npmjs添加" data-rss-adapter-source="npmjs">
                    <svg>
                        <use xlink:href="#iconNPM"></use>
                    </svg>
                </span>
                <span class="block__icon block__icon--show ariaLabel" aria-label="从远程思源添加" data-rss-adapter-source="siyuan">
                    <img src="/stage/icon.png" style="width: 24px;">
                </span>
            </div>
        </div>
    </div>
    <template v-for="item in list">
        <div class="fn__flex-1 fn__flex b3-card b3-card--wrap sac-rss-card" :data-rss-name='item' >
            <div class="b3-card__body fn__flex"  style="font-size:small !important;padding:0">
                <div class="b3-card__img">
                        <svg style="width:74px;height:74px"><use xlink:href="#iconRSS"></use></svg>
                </div>
                <div class="fn__flex-1 fn__flex-column">
                    <div class="b3-card__info b3-card__info--left fn__flex-1">
                         <span class="ft__on-surface ft__smaller">{{item}}</span>
                            <div class="b3-card__desc" :title="item.title">
                                {{item.description}}
                            </div>
                    </div> 
                </div>
                <div class="b3-card__actions b3-card__actions--right">
                    <span class="block__icon block__icon--show ariaLabel" aria-label="编辑rss规则">
                        <svg ><use xlink:href="#iconEdit"></use></svg>
                    </span>
                    <span class="block__icon block__icon--show ariaLabel" data-rss-name='${item}' aria-label="查看内容">
                    <svg ><use xlink:href="#iconList"></use></svg>
                </span>
                <span class="block__icon block__icon--show ariaLabel" aria-label="允许伺服">
                <input class="b3-switch fn__flex-center" checked="" data-type="plugin-enable" type="checkbox">                            
                </span>
                </div>
            </div>
        </div>

    </template>
</template>
<script setup>
import { sac } from 'runtime';
import { onMounted,ref } from 'vue';
let list = ref([])
onMounted(()=>{
    sac.路由管理器.internalFetch('/search/rss/list', {
        body: {
            page: 1
        }, method: 'POST'
    }).then(res=>{
        console.log(res.body.data)
        list.value =res.body.data
    })
})
</script>