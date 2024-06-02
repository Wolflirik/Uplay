<template>
    <div class="module small-playlist-list padd">
        <div class="module__head small-playlist-list__head">
            <h3 class="module__title small-playlist-list__title">Плейлисты</h3>
        </div>
        <div class="module__content small-playlist-list__content">
            <small-playlist-widget-block v-for="playlistId in playlistListIds" :key="playlistId" :playlist-id="playlistId" />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { action } from '@repo'
import SmallPlaylistWidgetBlock from '@block/SmallPlaylistWidgetBlock.vue'

const playlistListIds = computed(() => action.getPlaylistListIds('addedAt', 'asc').slice(0, +import.meta.env.PLAYER_DEFAULT_MODULE_ITEMS_LIMIT))

defineOptions({
    inheritAttrs: false,
})
</script>
