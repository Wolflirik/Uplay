<template>
    <div class="loader" :class="{ 'loader--status_loaded': reposCount === loadedReposCount }">
        <span class="loader__animate-box" :style="`--percent-loading:${percent};`">
            <icon-element name="logo" class="loader__icon" />
        </span>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { repos, action } from '@repo/index'
import { wait } from '@utils/utils'
import IconElement from '@element/IconElement.vue'

const reposKeys = Object.keys(repos)
const reposCount = reposKeys.length
const loadedReposCount = ref(0)

;(async () => {
    for (let key of reposKeys) {
        await action.bootRepo(key)
        loadedReposCount.value++
        await wait(200)
    }
})().then(async () => {
    await action.createStartSchema()
    emits('fullyLoaded')
})

const emits = defineEmits(['fullyLoaded'])

const percent = computed(() => {
    return `${(loadedReposCount.value / reposCount) * 100}%`
})
</script>
