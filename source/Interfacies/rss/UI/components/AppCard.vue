<template>
    <div class="fn__flex-1 fn__flex b3-card b3-card--wrap sac-rss-card">
        <div class="b3-card-body fn__flex">
            <div class="fn__flex fn__flex-column b3-card__info b3-card__info--left fn__flex-1">
                <div>
                    路由:{{ app.name }}
                </div>
                <div>
                    描述:{{ app.description }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['app']
}
</script>