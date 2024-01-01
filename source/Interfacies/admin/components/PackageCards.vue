<template>
    <div class="fn__flex-1 fn__flex-column">

        <PackageSearchIcons></PackageSearchIcons>
        <PackageTopicButtons v-if="appData.packageTypeTopic" :topic="appData.packageTypeTopic"
            @data-received="handleDataReceived"
            @topic-change="(topic) => {appData.packageTypeTopic=topic; checkPackageEnabled(appData.packageTypeTopic) }">
        </PackageTopicButtons>
        <div class="cc__divider__vertical surface-lighter" ></div>
        <div class=" b3-cards fn__flex-1 ">
            <PackageWarningCard v-if="!packageTypeEnabled.value" :topic="appData.packageTypeTopic"
                @topic-enabled="() => { checkPackageEnabled(appData.packageTypeTopic) }">
            </PackageWarningCard>
            <template v-if="packageTypeEnabled.value" v-for="repo in data" :key="repo.url">
                <!--  <PackageCard :repo="repo"></PackageCard>-->
                <div v-if="repo && repo.package">
                    <div class="fn__flex-1 fn__flex b3-card b3-card--wrap sac-rss-card" data-repo-name=''>
                        <div class="b3-card__body fn__flex" style="font-size:small !important;padding:0">
                            <div class="b3-card__img">
                                <img v-if="repo.iconUrl" style="width:74px;height:74px" :src="repo.iconUrl" />
                                <svg v-if="!repo.iconUrl" style="width:74px;height:74px">
                                    <use xlink:href="#iconRSS"></use>
                                </svg>
                            </div>
                            <div class="fn__flex-1 fn__flex-column">
                                <div class="b3-card__info b3-card__info--left fn__flex-1">
                                    <span class="ft__on-surface ft__smaller">{{ repo.package.name }}</span>
                                    <div class="b3-card__desc" title="${repo.name}">
                                        {{ getDescription(repo.package) }}
                                    </div>
                                    <div class="b3-card__desc" title="${repo.name}">
                                        {{ repo.package.version }}
                                    </div>
                                </div>
                                <div class="b3-card__actions ">

                                    <PackageInstallIcon :packageInfo="repo.package"
                                        @package-installed="() => { 判定尚未安装(repo) }">
                                    </PackageInstallIcon>

                                    <span v-if="!updated[repo.package.name]" class="block__icon block__icon--show ariaLabel"
                                        aria-label="更新" data-rss-name='${repo.name}' data-repo-name='${repo.repoUrl}'
                                        data-repo-source="github">
                                        <svg>
                                            <use xlink:href="#iconRefresh"></use>
                                        </svg>
                                    </span>
                                    <span v-if="installed[repo.package.name]"
                                        class="block__icon block__icon--show ariaLabel" aria-label="卸载"
                                        data-rss-name='${repo.name}' data-repo-name='${repo.repoUrl}'
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
import PackageAddCard from './PackageAddCard.vue';
import PackageSourceIcon from './PackageSourceIcon.vue';
import PackageInstallIcon from './PackageInstallIcon.vue';
import PackageSearchIcons from './PcakageSearchIcons.vue';
import PackageWarningCard from './PackageWarningCard.vue';
let data = ref([])
let installed = reactive({})
let updated = reactive({})
let appData = inject('appData')
let packageTypeEnabled =reactive( { value: false })
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
    console.log(e)
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
let checkPackageEnabled =async  (topic)=> {
    console.log(topic)
    await sac.路由管理器.internalFetch('/packages/checkPackageEnabled', {
        body: {
            topic: topic
        }, method: 'POST'
    }).then(
        res => {
            if (res && res.body && res.body.data && res.body.data.enabled) {
                packageTypeEnabled.value = true
            } else {
                packageTypeEnabled.value =false
            }
        }
    )

}
const uninstall = (repo) => {
    sac.路由管理器.internalFetch(`/packages/${appData.packageTypeTopic}/unInstall`, {
        body: {
            packageSource: repo.source,
            packageRepo: repo.repoUrl,
            packageName: repo.name
        }, method: 'POST'
    }).then(res => {
        setTimeout(() => 判定尚未安装(repo), 500)
    })
}
const 判定尚未安装 = (repo) => {
    console.log(repo)
    sac.路由管理器.internalFetch(`/packages/${appData.packageTypeTopic}/checkInstall`, {
        body: {
            packageSource: repo.package.source,
            packageRepo: repo.package.url,
            packageName: repo.package.name
        }, method: 'POST'
    }).then(res => {
        console.log(res)
        console.log(installed)
        installed[repo.package.name] = res.body
    })
}
const 判定需要更新 = (repo) => {
    sac.路由管理器.internalFetch(`/packages/${appData.packageTypeTopic}/meta`, {
        body: {
            packageSource: repo.source,
            packageRepo: repo.url,
            packageName: repo.name
        }, method: 'POST'
    }).then(res => {
        if (res.body.version === repo.version) {
            updated[repo.name] = res.body
        }
    })
}
const getDescription = (packageInfo) => {
    let description = packageInfo.description
    description = description || "没有描述"
    if (description[siyuan.config.language]) {
        description = description[siyuan.config.language]
    } else if (description.default) {
        description = description.default
    }
    return description
}
const handleDataReceived = async (_data) => {
    console.log('包数据更新', _data)
    await checkPackageEnabled(appData.packageTypeTopic)
    data.value.splice(0, data.value.length, ..._data)
    data.value.forEach(
        repo => {
            判定需要更新(repo)
            判定尚未安装(repo)
        }
    )
}
</script>