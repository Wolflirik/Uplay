<template>
    <router-custom-link-element :to="`/playlists/${playlistData.id}`" active-class="small-playlist-widget--status_active" exact-active-class="small-playlist-widget--status_active" class="small-playlist-widget">
        <span class="small-playlist-widget__emoji">{{ playlistData.emoji }}</span>
        <span class="small-playlist-widget__name">{{ playlistData.name }}</span>
    </router-custom-link-element>
</template>
<script setup>
import { action } from '@repo'
import RouterCustomLinkElement from '@element/RouterCustomLinkElement.vue'
import { computed } from 'vue'

const props = defineProps({
    playlistId: {
        type: String,
        required: true,
    },
})

const playlistData = computed(() => action.getPlaylistById(props.playlistId))

defineOptions({
    inheritAttrs: false,
})
</script>
