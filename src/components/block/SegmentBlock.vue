<template>
    <template v-for="segment in layoutSegments" :key="segment.component.__name">
        <component :is="segment.component" :class="segment.class" />
    </template>
</template>
<script setup>
import { inject } from 'vue'
import { getSegments } from '@utils/componentLoader'

const { innerWidth } = inject('appState')

const layoutSegments = getSegments(innerWidth)

defineOptions({
    inheritAttrs: false,
})
</script>
