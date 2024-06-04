<template>
    <span v-if="title.length" class="page-title" :class="{ 'page-title--animation_replace': title !== animatedTitle }" :data-new-title="title">{{ animatedTitle }}</span>
</template>
<script setup>
import { inject, ref, watchEffect } from 'vue'

const { title } = inject('appState')
const animatedTitle = ref('')

const setNewTitle = () => {
    animatedTitle.value = title.value
}

watchEffect(() => {
    document.title = `Uplay: ${title.value}`

    if (animatedTitle.value.length) {
        setTimeout(setNewTitle, 200)
    } else {
        setNewTitle()
    }
})
</script>
