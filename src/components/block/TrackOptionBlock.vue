<template>
    <router-custom-link-element :to="`/albums/${albumId}`" class="link option__item" v-if="!$route.params?.albumId">Посмотреть альбом</router-custom-link-element>
    <button-element
        type="link"
        class="option__item"
        @click="
            () => {
                $emit('selected')
                $emit('showFinder')
            }
        "
    >
        Добавить в плейлист
    </button-element>
    <button-element
        type="link"
        class="option__item"
        v-if="playlistListIds.includes($route.params?.playlistId)"
        @click="
            () => {
                action.removeTrackFromPlaylist(trackId, $route.params?.playlistId)
                $emit('selected')
            }
        "
    >
        Убрать из текущего плейлиста
    </button-element>
    <button-element
        type="link"
        class="option__item"
        @click="
            () => {
                action.removeTrack(trackId)
                $emit('selected')
            }
        "
    >
        Удалить трек
    </button-element>
</template>
<script setup>
import { action } from '@repo'
import { currentTrackId } from '@utils/player'
import ButtonElement from '@element/ButtonElement.vue'
import RouterCustomLinkElement from '@element/RouterCustomLinkElement.vue'

defineProps({
    trackId: {
        type: String,
        required: true,
    },
    albumId: {
        type: String,
        required: true,
    },
    playlistListIds: {
        type: Array,
        required: true,
    },
})

defineEmits(['selected', 'showFinder'])

defineOptions({
    inheritAttrs: false,
})
</script>
