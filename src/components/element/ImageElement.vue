<template>
    <img :src="base64" class="image" :class="$attrs.class" :alt="$attrs.alt" loading="lazy" />
</template>
<script setup>
import { computed } from 'vue'
import { action } from '@repo'

const props = defineProps({
    imageId: {
        type: String,
        required: true,
    },
})

const base64 = computed(() => action.getImageById(props.imageId))

defineOptions({
    inheritAttrs: false,
})
</script>
