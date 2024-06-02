<template>
    <div class="audio-volume" :class="[$attrs.class, `audio-volume--orientation_${orientation}`]" @mouseenter="showControl = true" @mouseleave="showControl = false" v-if="!isIOS">
        <button-element type="icon" @click="toggleMutedStatus" :disabled="$attrs.disabled">
            <icon-element :name="`volume-${volumeIconNumber}`" />
        </button-element>
        <div
            class="audio-volume__control"
            :class="orientation === 'vertical' ? (showControl && !mutedStatus ? 'audio-volume__control--status_visible' : 'audio-volume__control--status_invisible') : !mutedStatus ? 'audio-volume__control--status_visible' : 'audio-volume__control--status_invisible'"
            v-if="!$attrs.disabled"
        >
            <input type="range" step="0.1" min="0.1" max="1" :value="currentVolume" @input="setCurrentVolume($event.target.value)" class="audio-volume__control-range" />
            <svg class="audio-volume__control-background" aria-hidden="true">
                <use :xlink:href="`#trapezoid-${orientation}`"></use>
            </svg>
            <svg class="audio-volume__control-overground" aria-hidden="true" :style="`--percent-volume:${currentVolume * 100}%`">
                <use :xlink:href="`#trapezoid-${orientation}`"></use>
            </svg>
        </div>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { mutedStatus, currentVolume, setCurrentVolume, toggleMutedStatus, isIOS } from '@utils/player'
import ButtonElement from '@element/ButtonElement.vue'
import IconElement from '@element/IconElement.vue'

defineProps({
    orientation: {
        type: String,
        default: 'vertical',
        validator(value) {
            return ['horizontal', 'vertical'].includes(value)
        },
    },
})
const showControl = ref(false)

const volumeIconNumber = computed(() => {
    if (mutedStatus.value) {
        return 0
    } else if (currentVolume.value >= 0.1 && currentVolume.value < 0.3) {
        return 1
    } else if (currentVolume.value >= 0.3 && currentVolume.value < 0.7) {
        return 2
    } else {
        return 3
    }
})

defineOptions({
    inheritAttrs: false,
})
</script>
