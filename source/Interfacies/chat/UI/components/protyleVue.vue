<template>
            <div ref="Container"></div>

</template>
<script setup>
import { ref, onMounted } from 'vue';
import { sac, clientApi } from 'runtime';
console.log(clientApi)
console.log(clientApi.Protyle)
const Container = ref(null)
onMounted(
    () => {
        new clientApi.Protyle(
            sac.app, Container.value, {
            blockId: "20230808120348-hynr7og",
            render: {
                title: false,
                background: false,
                scroll: true,
                gutter: true,
            },
        }
        )
    }
)


</script>