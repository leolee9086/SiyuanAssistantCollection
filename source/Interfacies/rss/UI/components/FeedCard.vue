<template>
    <div class="fn__flex-1 fn__flex b3-card b3-card--wrap sac-rss-card">
        <div class="b3-card-body fn__flex">
            <div class="fn__flex fn__flex-column b3-card__info b3-card__info--left fn__flex-1">
                <div>
                    {{ feed.title }}
                </div>
                <div>
                    路由:{{ feed.path }}
                </div>
                <div>
                    描述:{{ feed.description }}
                </div>
                <div>
                    更新规则:{{ feed.timer }}
                    <cronEditor v-model="feed.timer"></cronEditor>
                </div>
                <div><a @click="openContent">查看最新内容</a></div>

            </div>

        </div>
    </div>
</template>
<script>
import cronEditor from '../../../../UI/components/cronEditor.vue'

import { sac } from 'runtime';
export default {
    components: {
        cronEditor
    },
    props: ['feed'],
    methods:{
        openContent(){
        let that =this   
        console.log(that.feed) 
        sac.eventBus.emit('rss-ui-open-tab',{
            feed:that.feed,
            title:that.feed.title,
            icon:that.feed.icon||"",
            type:'rssGrid'
        })}
    }
}
</script>