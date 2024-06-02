<template>
    <div class="finder">
        <input-element type="text" v-model="name" label="Поиск прейлистов" placeholder="Избранное ..." />
        <div class="finder__result">
            <template v-if="playlistList.length">
                <button-element
                    v-for="playlistData in playlistList"
                    :key="playlistData.id"
                    type="link"
                    class="finder__item"
                    @click="
                        () => {
                            action.addTrackToPlaylist(trackId, playlistData.id)
                            $emit('selected')
                        }
                    "
                >
                    <span class="finder__item-emoji">{{ playlistData.emoji }}</span>
                    <span class="finder__item-name">{{ playlistData.name }}</span>
                </button-element>
            </template>
            <span class="finder__result-empty" v-else>
                По вашему запросу ничего
                <br />
                не найдено!
            </span>
        </div>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { action } from '@repo'
import InputElement from '@element/InputElement.vue'
import ButtonElement from '@element/ButtonElement.vue'

defineProps({
    trackId: {
        type: String,
        required: true,
    },
})

defineEmits(['selected'])

const name = ref('')
const playlistList = computed(() => action.getPlaylistListByName(name.value, 'addedAt', 'asc').slice(0, +import.meta.env.PLAYER_DEFAULT_ITEMS_LIMIT))
</script>
