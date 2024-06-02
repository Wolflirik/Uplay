<template>
    <router-custom-link-element :to="`/genres/${genreData.id}`" class="small-genre-widget" :class="$attrs.class">{{ genreData.name }}</router-custom-link-element>
</template>
<script setup>
import { action } from '@repo'
import RouterCustomLinkElement from '@element/RouterCustomLinkElement.vue'

const props = defineProps({
    genreId: {
        type: String,
        required: true,
    },
})

const genreData = action.getGenreById(props.genreId)

defineOptions({
    inheritAttrs: false,
})
</script>
