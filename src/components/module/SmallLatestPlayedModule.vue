<template>
    <div class="module small-latest-played padd" v-if="allTrackListIds.length">
        <div class="module__head small-latest-played__head">
            <h3 class="module__title small-latest-played__title">Прослушано ранее</h3>
        </div>
        <div class="module__content small-latest-played__content">
            <small-track-widget-block v-for="trackId in trackIds" :key="trackId" :track-id="trackId" :track-list-ids="allTrackListIds" />
        </div>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { action } from '@repo'
import SmallTrackWidgetBlock from '@block/SmallTrackWidgetBlock.vue'

const page = ref(1)

const allTrackListIds = computed(() => action.getPlayedTrackIds('playedAt', 'desc'))
const trackIds = computed(() => allTrackListIds.value.slice(0, +import.meta.env.PLAYER_DEFAULT_MODULE_ITEMS_LIMIT))
</script>
