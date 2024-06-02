<template>
    <span v-if="title.length" class="page-title">{{ title }}</span>
</template>
<script setup>
import { inject, watch } from 'vue'

const { title } = inject('appState')

watch(title, newTitle => {
    document.title = `Uplay: ${newTitle}`
})
</script>
