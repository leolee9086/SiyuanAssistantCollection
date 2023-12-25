<template>
    <div class="fn__flex-1 fn__flex b3-card b3-card--wrap sac-rss-card">
        <div class="b3-card-body fn__flex fn__flex-1">
            <div class="fn__flex fn__flex-column b3-card__info b3-card__info--left fn__flex-1">
                <div>
                    路由:{{ router.endpoint }}
                </div>
                <div>
                    描述:{{ router.description }}
                </div>
            </div>
            <div class="b3-card__actions b3-card__actions--right">
                <span class="block__icon block__icon--show ariaLabel" aria-label="添加rss订阅">
                    <svg>
                        <use xlink:href="#iconAdd"></use>
                    </svg>
                </span>
                <span class="block__icon block__icon--show ariaLabel" aria-label="允许伺服">
                    <input class="b3-switch fn__flex-center" checked="" data-type="plugin-enable" type="checkbox">
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['router']
}
</script>