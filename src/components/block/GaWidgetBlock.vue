<template>
    <div class="ga-widget" :class="{ 'ga-widget--status_in-grid': inGrid }" :style="$attrs.style">
        <image-grid-element class="ga-widget__image-back-blurred-wrap" :image-ids="imageIds" v-if="inGrid" />
        <router-custom-link-element :to="`/${type}s/${data.id}`">
            <image-grid-element class="ga-widget__image-wrap" :image-ids="imageIds" />
            <span class="ga-widget__name">{{ data.name }}</span>
            <span class="ga-widget__info">{{ trackIds.length + ' ' + declOfNum(trackIds.length, ['трек', 'трека', 'треков']) }}</span>
        </router-custom-link-element>
    </div>
</template>
<script setup>
import { computed } from 'vue'
import { action } from '@repo'
import { declOfNum } from '@utils/utils'
import RouterCustomLinkElement from '@element/RouterCustomLinkElement.vue'
import ImageGridElement from '@element/ImageGridElement.vue'

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    inGrid: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        required: true,
        validator(value) {
            return ['genre', 'artist'].includes(value)
        },
    },
})

const capitalizeType = props.type.charAt(0).toUpperCase() + props.type.slice(1)

const data = action[`get${capitalizeType}ById`](props.id)

const trackIds = computed(() => action[`getTrackListIdsBy${capitalizeType}Id`](data.id, 0, 9999))
const imageIds = computed(() => action.getImageIdsByTrackIds(trackIds.value))

defineOptions({
    inheritAttrs: false,
})
</script>
