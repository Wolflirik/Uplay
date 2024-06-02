<template>
    <router-custom-link-element :to="`/artists/${artistData.id}`" class="artist-widget" :class="$attrs.class">{{ artistData.name }}</router-custom-link-element>
</template>
<script setup>
import { action } from '@repo'
import RouterCustomLinkElement from '@element/RouterCustomLinkElement.vue'

const props = defineProps({
    artistId: {
        type: String,
        required: true,
    },
})

const artistData = action.getArtistById(props.artistId)

defineOptions({
    inheritAttrs: false,
})
</script>
