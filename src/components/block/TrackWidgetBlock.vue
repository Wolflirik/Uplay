<template>
    <div class="track-widget">
        <div class="track track-widget__info">
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

        <div class="track-widget__item track-widget__album">
            <icon-element name="note-square" class="track-widget__item-icon" />
            <span class="track-widget__item-text">
                <router-custom-link-element :to="`/albums/${albumData.id}`">
                    <span>{{ albumData.title }}</span>
                </router-custom-link-element>
            </span>
        </div>

        <div class="track-widget__item track-widget__genre">
            <icon-element name="note" class="track-widget__item-icon" />
            <span class="track-widget__item-text">
                <small-genre-widget-block v-for="genreId in genreListIds" :key="genreId" :genre-id="genreId" />
            </span>
        </div>

        <div class="track-widget__item track-widget__duration">
            <icon-element name="clock" class="track-widget__item-icon" />
            <span class="track-widget__item-text">{{ prettyTimeBySeconds(trackData.duration) }}</span>
        </div>

        <favorite-widget-block :id="trackData.id" />

        <div class="track-widget__menu">
            <button-element type="icon" @click="trackMenuStatus = !trackMenuStatus" :id="`track-widget-${trackData.id}`">
                <icon-element name="more" />
            </button-element>
            <transition
                name="dropdown"
                enter-active-class="dropdown--animation_active"
                enter-from-class="dropdown--animation_active-from"
                enter-to-class="dropdown--animation_active-to"
                leave-active-class="dropdown--animation_leave"
                leave-from-class="dropdown--animation_leave-from"
                leave-to-class="dropdown--animation_leave-to"
            >
                <dropdown-block v-if="trackMenuStatus" @close-dropdown="trackMenuStatus = false">
                    <div class="dropdown__content-item">
                        <div class="option">
                            <track-option-block :track-id="trackData.id" :album-id="albumData.id" :playlist-list-ids="playlistListIds" @show-finder="showFinder = true" @selected="trackMenuStatus = false" />
                        </div>
                    </div>
                </dropdown-block>
            </transition>
            <transition
                name="popup"
                enter-active-class="popup--animation_active"
                enter-from-class="popup--animation_active-from"
                enter-to-class="popup--animation_active-to"
                leave-active-class="popup--animation_leave"
                leave-from-class="popup--animation_leave-from"
                leave-to-class="popup--animation_leave-to"
            >
                <popup-block v-if="showFinder" @close-popup="showFinder = false">
                    <playlist-finder-block :track-id="trackData.id" @selected="showFinder = false" />
                </popup-block>
            </transition>
        </div>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { action } from '@repo'
import { prettyTimeBySeconds } from '@utils/utils'
import { addToQueue, cleanQueue, currentPlayStatus, pause, play } from '@utils/player'
import IconElement from '@element/IconElement.vue'
import RouterCustomLinkElement from '@element/RouterCustomLinkElement.vue'
import ButtonElement from '@element/ButtonElement.vue'
import DropdownBlock from '@block/DropdownBlock.vue'
import SmallGenreWidgetBlock from '@block/SmallGenreWidgetBlock.vue'
import FavoriteWidgetBlock from '@block/FavoriteWidgetBlock.vue'
import TrackOptionBlock from '@block/TrackOptionBlock.vue'
import PlaylistFinderBlock from '@block/PlaylistFinderBlock.vue'
import PopupBlock from '@block/PopupBlock.vue'
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

const trackMenuStatus = ref(false)
const showFinder = ref(false)
const trackData = computed(() => action.getTrackById(props.trackId))
const artistListIds = computed(() => action.getArtistIdsByTrackIds([trackData.value.id]))
const genreListIds = computed(() => action.getGenreIdsByTrackIds([trackData.value.id]))
const albumData = computed(() => action.getAlbumById(trackData.value.albumId))
const playlistListIds = computed(() => action.getPlaylistIdsByTrackIds(trackData.value.id))

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
