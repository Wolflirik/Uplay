<template>
    <div class="track track--border_rounded">
        <image-element class="track__image" :image-id="trackData.imageId" :alt="trackData.name" />
        <div class="track__control">
            <div class="track__play-animation" v-if="playStatus">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <button-element type="icon" class="track__control-button" @click="playStatus ? pause() : initPlay()">
                <icon-element :name="playStatus ? 'stop-bold' : 'play-bold'" />
            </button-element>
        </div>

        <div class="track__description">
            <span class="track__name">{{ trackData.name }}</span>
            <div class="track__artist">
                <artist-widget-block v-for="artistId in artistListIds" :key="artistId" :artist-id="artistId" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { action } from '@repo'
import { addToQueue, cleanQueue, currentPlayStatus, pause, play } from '@utils/player'
import IconElement from '@element/IconElement.vue'
import ButtonElement from '@element/ButtonElement.vue'
import ArtistWidgetBlock from '@block/ArtistWidgetBlock.vue'
import ImageElement from '@element/ImageElement.vue'

const props = defineProps({
    trackId: {
        type: String,
        required: true,
    },
    trackListIds: {
        type: Array,
        required: true,
    },
})

const showFinder = ref(false)
const trackData = computed(() => action.getTrackById(props.trackId))
const artistListIds = computed(() => action.getArtistIdsByTrackIds([trackData.value.id]))

const playStatus = computed(() => currentPlayStatus(props.trackId))

const initPlay = () => {
    cleanQueue()
    addToQueue(props.trackListIds)
    play(props.trackId)
}

defineOptions({
    inheritAttrs: false,
})
</script>
