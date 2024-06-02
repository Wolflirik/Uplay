<template>
    <div class="track">
        <image-element class="track__image" :image-id="imageId" :alt="name" />
        <div class="track__control" v-if="showControls">
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
            <span class="track__name">{{ name }}</span>
            <div class="track__artist">
                <artist-widget-block v-for="artistId in artistListIds" :key="artistId" :artist-id="artistId" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue'
import { addToQueue, play, pause, currentPlayStatus, cleanQueue } from '@utils/player'
import ArtistWidgetBlock from '@block/ArtistWidgetBlock.vue'
import ImageElement from '@element/ImageElement.vue'
import ButtonElement from '@element/ButtonElement.vue'
import IconElement from '@element/IconElement.vue'

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    imageId: {
        type: String,
        required: true,
    },
    showControls: {
        type: Boolean,
        default: false,
    },
    artistListIds: {
        type: Array,
        required: true,
    },
    trackListIds: {
        type: Array,
        validator(value, props) {
            return props.showControls ? value.length : true
        },
    },
})

const playStatus = computed(() => currentPlayStatus(props.id))

const initPlay = () => {
    cleanQueue()
    addToQueue(props.trackListIds)
    play(props.id)
}

defineOptions({
    inheritAttrs: false,
})
</script>
