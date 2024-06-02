<template>
    <section class="player padd">
        <div class="track player__track-info">
            <image-element class="track__image" v-if="trackData?.imageId" :image-id="trackData.imageId" :alt="trackData.name" />
            <div class="track__image" v-else></div>

            <div class="track__description">
                <span class="track__name">{{ trackData?.name }}</span>
                <div class="track__artist">
                    <template v-if="trackData?.id">
                        <artist-widget-block v-for="artistId in artistListIds" :key="artistId" :artist-id="artistId" />
                    </template>
                </div>
            </div>
        </div>
        <div class="player__control">
            <button-element type="icon" class="player__shuffle" @click="toggleShuffleType" :disabled="!trackData?.id">
                <icon-element :name="`rand-${shuffleType}`" />
            </button-element>
            <button-element type="icon" @click="prev" :disabled="!trackData?.id || disablePrev">
                <icon-element name="prev" />
            </button-element>
            <button-element type="icon" @click="playStatus ? pause() : play(currentTrackId)" :disabled="!trackData?.id">
                <icon-element :name="playStatus ? 'stop' : 'play'" />
            </button-element>
            <button-element type="icon" @click="next" :disabled="!trackData?.id || disableNext">
                <icon-element name="next" />
            </button-element>
            <button-element type="icon" class="player__repeat" @click="toggleRepeatType" :disabled="!trackData?.id">
                <icon-element :name="`repeat-${repeatType}`" />
            </button-element>
        </div>
        <div class="player__progress">
            <span class="player__progress-time">{{ prettyTimeBySeconds(currentTime) }}</span>
            <audio-progress-bar-block />
            <span class="player__progress-time">{{ prettyTimeBySeconds(duration - currentTime) }}</span>
        </div>
        <div class="player__control">
            <audio-volume-block class="player__volume" :disabled="!trackData?.id" />
            <favorite-widget-block class="player__favorite" :id="trackData?.id" :disabled="!trackData?.id" />
            <button-element
                type="icon"
                class="player__clear"
                @click="
                    () => {
                        pause()
                        setCurrentTime(0)
                        setDefaultChunks()
                        cleanQueue()
                    }
                "
                :disabled="!trackData?.id"
            >
                <icon-element name="clear-queue" />
            </button-element>
            <button-element type="link" class="player__maximize" @click="maximizePlayer = true" :disabled="!trackData?.id">
                <icon-element name="maximize" />
            </button-element>
        </div>
        <transition
            name="popup"
            enter-active-class="popup--animation_active"
            enter-from-class="popup--animation_active-from"
            enter-to-class="popup--animation_active-to"
            leave-active-class="popup--animation_leave"
            leave-from-class="popup--animation_leave-from"
            leave-to-class="popup--animation_leave-to"
        >
            <popup-block v-if="maximizePlayer" @close-popup="maximizePlayer = false">
                <div class="player-maximized">
                    <image-element class="player-maximized__image-back-blurred" v-if="trackData?.imageId" :image-id="trackData.imageId" :alt="trackData.name" />
                    <image-element class="player-maximized__image" v-if="trackData?.imageId" :image-id="trackData.imageId" :alt="trackData.name" />
                    <div class="player-maximized__info">
                        <span class="player-maximized__name">{{ trackData?.name }}</span>
                        <div class="player-maximized__artist">
                            <template v-if="trackData?.id">
                                <artist-widget-block v-for="artistId in artistListIds" :key="artistId" :artist-id="artistId" />
                            </template>
                        </div>
                    </div>
                    <div class="player-maximized__control">
                        <button-element type="icon" class="player-maximized__shuffle" @click="toggleShuffleType" :disabled="!trackData?.id">
                            <icon-element :name="`rand-${shuffleType}`" />
                        </button-element>
                        <button-element type="icon" class="player-maximized__control-main-item" @click="prev" :disabled="!trackData?.id || disablePrev">
                            <icon-element name="prev" />
                        </button-element>
                        <button-element type="icon" class="player-maximized__control-main-item" @click="playStatus ? pause() : play(currentTrackId)" :disabled="!trackData?.id">
                            <icon-element :name="playStatus ? 'stop' : 'play'" />
                        </button-element>
                        <button-element type="icon" class="player-maximized__control-main-item" @click="next" :disabled="!trackData?.id || disableNext">
                            <icon-element name="next" />
                        </button-element>
                        <button-element type="icon" class="player-maximized__repeat" @click="toggleRepeatType" :disabled="!trackData?.id">
                            <icon-element :name="`repeat-${repeatType}`" />
                        </button-element>
                        <favorite-widget-block class="player-maximized__favorite" :id="trackData?.id" :disabled="!trackData?.id" />
                        <button-element
                            type="icon"
                            class="player-maximized__clear"
                            @click="
                                () => {
                                    pause()
                                    setCurrentTime(0)
                                    setDefaultSamples()
                                    cleanQueue()
                                    maximizePlayer = false
                                }
                            "
                            :disabled="!trackData?.id"
                        >
                            <icon-element name="clear-queue" />
                        </button-element>
                    </div>
                    <div class="player-maximized__progress">
                        <span class="player-maximized__progress-time">{{ prettyTimeBySeconds(currentTime) }}</span>
                        <audio-progress-bar-block />
                        <span class="player-maximized__progress-time">{{ prettyTimeBySeconds(duration - currentTime) }}</span>
                    </div>
                    <audio-volume-block class="player-maximized__volume" orientation="horizontal" :disabled="!trackData?.id" />
                </div>
            </popup-block>
        </transition>
    </section>
</template>
<script setup>
import { computed, ref } from 'vue'
import { action } from '@repo'
import { currentTrackId, pause, play, next, prev, playStatus, repeatType, shuffleType, toggleRepeatType, toggleShuffleType, disablePrev, disableNext, cleanQueue, setCurrentTime, setDefaultSamples, duration, currentTime } from '@utils/player'
import ArtistWidgetBlock from '@block/ArtistWidgetBlock.vue'
import ImageElement from '@element/ImageElement.vue'
import ButtonElement from '@element/ButtonElement.vue'
import IconElement from '@element/IconElement.vue'
import AudioProgressBarBlock from '@block/AudioProgressBarBlock.vue'
import FavoriteWidgetBlock from '@block/FavoriteWidgetBlock.vue'
import AudioVolumeBlock from '@block/AudioVolumeBlock.vue'
import PopupBlock from '@block/PopupBlock.vue'
import { prettyTimeBySeconds } from '@utils/utils'

const maximizePlayer = ref(false)
const trackData = computed(() => action.getTrackById(currentTrackId.value))
const artistListIds = computed(() => action.getArtistIdsByTrackIds([trackData.value.id]))
</script>
