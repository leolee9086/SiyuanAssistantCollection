<template>
    <div class="fn__flex-1 fn__flex-column">
        <PackageSearchIcons></PackageSearchIcons>
        <PackageTopicButtons 
        :topic="currentTopic" 
        @topic-change="(topic) => handlerCurrentTopicChange(topic)">
        </PackageTopicButtons>
        <div class="cc__divider__vertical surface-lighter"></div>
        <div class=" b3-cards fn__flex-1 ">
            <PackageWarningCard v-if="!packageTypeEnabled.value" :topic="currentTopic"
                @enabel-topic="() => { checkPackageEnabled(currentTopic) }">
            </PackageWarningCard>
            <template v-if="packageTypeEnabled.value" v-for="repo in data" :key="repo.url">
                <!--  <PackageCard :repo="repo"></PackageCard>-->
                <div v-if="repo && repo.package">
                    <div class="fn__flex-1 fn__flex b3-card b3-card--wrap sac-rss-card" data-repo-name=''>
                        <div class="b3-card__body fn__flex" style="font-size:small !important;padding:0">
                            <cardImage :repo="repo"></cardImage>
                            <div class="fn__flex-1 fn__flex-column">
                                <cardInfo :repo="repo"></cardInfo>
                                <div class="b3-card__actions ">
                                    <PackageInstallIcon :packageInfo="repo.package" v-if="!installed[repo.name]"
                                        @package-installed="() => { 判定尚未安装(repo, installed) }">
                                    </PackageInstallIcon>
                                    <span v-if="!updated[repo.name]" class="block__icon block__icon--show ariaLabel"
                                        aria-label="更新" data-rss-name='${repo.name}' data-repo-name='${repo.repoUrl}'
                                        data-repo-source="github">
                                        <svg>
                                            <use xlink:href="#iconRefresh"></use>
                                        </svg>
                                    </span>
                                    <span v-if="installed[repo.name]" class="block__icon block__icon--show ariaLabel"
                                        aria-label="卸载" data-rss-name='${repo.name}' data-repo-name='${repo.repoUrl}'
                                        data-repo-source="github" @click="() => { uninstall(repo) }">
                                        <svg>
                                            <use xlink:href="#iconTrashcan"></use>
                                        </svg>
                                    </span>
                                    <PackageSourceIcon :packageInfo="repo.package"></PackageSourceIcon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<script setup>
import { sac } from 'runtime'
import { ref, onMounted, reactive, inject } from 'vue';
import PackageTopicButtons from './PackageTopicButtons.vue';
import PackageSourceIcon from './PackageSourceIcon.vue';
import PackageInstallIcon from './PackageInstallIcon.vue';
import PackageSearchIcons from './PcakageSearchIcons.vue';
import PackageWarningCard from './PackageWarningCard.vue';
import cardImage from './Package/cardImage.vue';
import cardInfo from './Package/cardInfo.vue';


import {判定尚未安装,enable} from '../../utils/package.js'


let data = ref([])
let installed = reactive({})
let updated = reactive({})
let appData = inject('appData')
appData.packageTypeTopic = appData.packageTypeTopic || 'siyuan-plugin'
let currentTopic = ref(appData.packageTypeTopic)
let packageTypeEnabled = reactive({ value: false })
onMounted(() => {
    sac.路由管理器.internalFetch(`/packages/${appData.packageTypeTopic}/listRemote`, {
        body: {
            page: 1
        }, method: 'POST'
    }).then(res => {
        handleDataReceived(res.body)
    })
})
sac.eventBus.on('statusChange', (e) => {
    if (e.detail && e.detail.name === `packages.${appData.packageTypeTopic}`) {
        sac.路由管理器.internalFetch(`/packages/${appData.packageTypeTopic}/listRemote`, {
            body: {
                page: 1
            }, method: 'POST'
        }).then(res => {
            handleDataReceived(res.body)
        })
    }
})
const handlerCurrentTopicChange = async (topic) => {
    currentTopic.value = topic;
    data.value =[]
    checkPackageEnabled(topic)
    sac.路由管理器.internalFetch(`/packages/${topic}/listRemote`, { method: "POST" }).then(
        data => {
            handleDataReceived(data.body)
        }
    )
}
let checkPackageEnabled = async (topic) => {
    let res = await enable(topic)
    if (res.body&&res.body.data && res.body.data.enabled) {
    await sac.路由管理器.internalFetch('/packages/checkPackageEnabled', {
        body: {
            topic: topic
        }, method: 'POST'
    }).then(
        res => {
            if (res && res.body && res.body.data && res.body.data.enabled) {
                packageTypeEnabled.value = true
            } else {
                packageTypeEnabled.value = false
            }
        }
    )
    }
}
const uninstall = (repo) => {
    sac.路由管理器.internalFetch(`/packages/${appData.packageTypeTopic}/unInstall`, {
        body: repo.package, method: 'POST'
    }).then(res => {
        setTimeout(() => 判定尚未安装(repo), 500)
    })
}

const 判定需要更新 = (repo) => {
    repo && sac.路由管理器.internalFetch(`/packages/${appData.packageTypeTopic}/meta`, {
        body: repo.package, method: 'POST'

    }).then(res => {
        if (res.body.version === repo.version) {
            updated[repo.name] = res.body
        }
    })
}

const handleDataReceived = async (_data) => {
    console.log(_data)
    await checkPackageEnabled(appData.packageTypeTopic)
    data.value.splice(0, data.value.length, ..._data)
    data.value.forEach(
        repo => {
            判定需要更新(repo, installed.value)
            判定尚未安装(repo, installed.value)
        }
    )
}
</script>