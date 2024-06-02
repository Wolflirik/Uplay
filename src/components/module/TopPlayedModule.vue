<template>
    <div class="module" v-if="allTrackListIds.length">
        <div class="module__head padd">
            <h2 class="module__title">Хиты прослушивания</h2>
        </div>
        <div class="module__content">
            <div class="padd">
                <track-widget-block v-for="trackId in trackIds" :key="trackId" :track-id="trackId" :track-list-ids="allTrackListIds" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, inject, nextTick, ref, watch } from 'vue'
import { action } from '@repo'
import TrackWidgetBlock from '@block/TrackWidgetBlock.vue'

const page = ref(1)

const allTrackListIds = computed(() => action.getPlayedTrackIds('playCount', 'desc'))
const trackIds = computed(() => allTrackListIds.value.slice(0, page.value * +import.meta.env.PLAYER_DEFAULT_MODULE_ITEMS_LIMIT))

const { paginate, content } = inject('appState')

const paginatePage = newValue => {
    if (newValue) {
        nextTick(() => {
            if (trackIds.value.length) {
                if (content.value.scrollHeight <= content.value.scrollTop + content.value.offsetHeight + 130) {
                    page.value++

                    if (trackIds.value.length < allTrackListIds.value.length) {
                        paginatePage(true)
                    }
                } else {
                    paginate.value = false
                }
            } else {
                page.value++
            }
        })
    }
}

watch(paginate, paginatePage)

paginatePage(true)
</script>
