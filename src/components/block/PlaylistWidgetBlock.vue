<template>
    <div class="playlist-widget" :class="{ 'playlist-widget--status_in-grid': inGrid }" :style="$attrs.style">
        <div class="playlist-widget__emoji-back-blurred">
            {{ playlistData.emoji }}
        </div>
        <router-custom-link-element :to="`/playlists/${playlistData.id}`">
            <div class="playlist-widget__emoji">{{ playlistData.emoji }}</div>
            <span class="playlist-widget__name">{{ playlistData.name }}</span>
            <span class="playlist-widget__info">{{ trackIds.length + ' ' + declOfNum(trackIds.length, ['трек', 'трека', 'треков']) }} • Создан: {{ prettyDateByTimestamp(playlistData.addedAt) }}</span>
        </router-custom-link-element>
        <div class="playlist-widget__artist">
            <artist-widget-block v-for="artistId in artistListIds" :key="artistId" :artist-id="artistId" />
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue'
import { action } from '@repo'
import { declOfNum, prettyDateByTimestamp } from '@utils/utils'
import RouterCustomLinkElement from '@element/RouterCustomLinkElement.vue'
import ArtistWidgetBlock from '@block/ArtistWidgetBlock.vue'

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    inGrid: {
        type: Boolean,
        default: false,
    },
})

const playlistData = action.getPlaylistById(props.id)
const trackIds = computed(() => action.getTrackListIdsByPlaylistId(playlistData.id, 0, 9999))
const imageId = computed(() => action.getImageIdByTrackIds(trackIds.value))
// const year = computed(() => action.getYearByTrackIds(trackIds.value))
const artistListIds = computed(() => action.getArtistIdsByTrackIds(trackIds.value))

defineOptions({
    inheritAttrs: false,
})
</script>
