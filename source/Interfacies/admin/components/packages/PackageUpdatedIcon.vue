<template>
    <span v-if="!updated[repo.package.name]" class="block__icon block__icon--show ariaLabel" aria-label="更新"
        data-rss-name='${repo.name}' data-repo-name='${repo.repoUrl}' data-repo-source="github">
        <svg>
            <use xlink:href="#iconRefresh"></use>
        </svg>
    </span>
</template>
<script setup>

</script>