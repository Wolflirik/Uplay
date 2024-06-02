<template>
    <button-element type="icon" class="favorite" :class="[inFavorite ? 'favorite--status_in' : 'favorite--status_out', $attrs.class]" @click="inFavorite ? action.removeTrackFromFavorite(id) : action.addTrackToFavorite(id)" :disabled="$attrs.disabled">
        <icon-element name="heart" />
    </button-element>
</template>
<script setup>
import { action } from '@repo'
import ButtonElement from '@element/ButtonElement.vue'
import IconElement from '@element/IconElement.vue'
import { computed } from 'vue'

const props = defineProps({
    id: {
        type: String,
    },
})

const inFavorite = computed(() => action.checkInFavorite(props?.id))

defineOptions({
    inheritAttrs: false,
})
</script>
