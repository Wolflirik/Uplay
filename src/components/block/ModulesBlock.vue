<template>
    <template v-for="module in sidebarModules" :key="module.__name">
        <component :is="module" />
    </template>
</template>
<script setup>
import { inject } from 'vue'
import { getModules } from '@utils/componentLoader'

const props = defineProps({
    position: {
        type: String,
        required: true,
        validator(value) {
            return ['sidebar', 'content', 'header'].includes(value)
        },
    },
})

const { innerWidth } = inject('appState')

const sidebarModules = getModules(props.position, innerWidth)

defineOptions({
    inheritAttrs: false,
})
</script>
