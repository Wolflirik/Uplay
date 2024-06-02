<template>
    <div class="album-widget" :class="{ 'album-widget--status_in-grid': inGrid }" :style="$attrs.style">
        <image-element class="album-widget__image-back-blurred" :image-id="imageId" :alt="albumData.title" v-if="inGrid" />
        <router-custom-link-element :to="`/albums/${albumData.id}`">
            <image-element class="album-widget__image" :image-id="imageId" :alt="albumData.title" />
            <span class="album-widget__title">{{ albumData.title }}</span>
            <span class="album-widget__info">{{ trackIds.length + ' ' + declOfNum(trackIds.length, ['трек', 'трека', 'треков']) }}{{ +year ? ' • ' + year + ' год' : '' }}</span>
        </router-custom-link-element>
        <div class="album-widget__artist" v-if="inGrid">
            <artist-widget-block v-for="artistId in artistListIds" :key="artistId" :artist-id="artistId" />
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue'
import { action } from '@repo'
import { declOfNum } from '@utils/utils'
import ImageElement from '@element/ImageElement.vue'
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

const albumData = action.getAlbumById(props.id)
const trackIds = computed(() => action.getTrackListIdsByAlbumId(albumData.id, 0, 9999))
const imageId = computed(() => action.getImageIdByTrackIds(trackIds.value))
const year = computed(() => action.getYearByTrackIds(trackIds.value))
const artistListIds = computed(() => (props.inGrid ? action.getArtistIdsByTrackIds(trackIds.value) : []))

defineOptions({
    inheritAttrs: false,
})
</script>
