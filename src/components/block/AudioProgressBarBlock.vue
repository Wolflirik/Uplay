<template>
    <div class="audio-progress-bar" :class="$attrs.class">
        <input type="range" :value="currentTime" min="0" :max="duration - 0.5" @input.passive="setCurrentTime($event.target.value)" class="audio-progress-bar__range" />

        <div class="audio-progress-bar__background">
            <span v-for="key in chunkLimit" :key="key" :style="`--size: ${samples[key]}%`" class="audio-progress-bar__chunk"></span>
        </div>
        <div class="audio-progress-bar__overground" :style="`--percent-played:${(currentTime / duration) * 100}%`">
            <span v-for="key in chunkLimit" :key="key" :style="`--size: ${samples[key]}%`" class="audio-progress-bar__chunk"></span>
        </div>
    </div>
</template>
<script setup>
import { samples, currentTime, duration, setCurrentTime } from '@utils/player'

const chunkLimit = +import.meta.env.PLAYER_DEFAULT_SAMPLES_LIMIT - 1

defineOptions({
    inheritAttrs: false,
})
</script>
