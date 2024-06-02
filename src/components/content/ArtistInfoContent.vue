<template>
    <transition
        name="dropdown"
        enter-active-class="dropdown--animation_active"
        enter-from-class="dropdown--animation_active-from"
        enter-to-class="dropdown--animation_active-to"
        leave-active-class="dropdown--animation_leave"
        leave-from-class="dropdown--animation_leave-from"
        leave-to-class="dropdown--animation_leave-to"
    >
        <dropdown-block v-if="menuDropdownPageName === 'artist-info' && selectedFilters?.artistInfo" trigger-element-id="menu-trigger" @close-dropdown="menuDropdownPageName = ''">
            <div class="dropdown__content-item">
                <div class="dropdown__title">
                    <icon-element name="filter" />
                    <span>Фильтр</span>
                </div>
                <filter-block :selected-direction="selectedFilters.artistInfo.direction" :selected-field="selectedFilters.artistInfo.field" :filters="filters" @filter="setFilters" />
            </div>
            <div class="dropdown__content-item">
                <div class="dropdown__title">
                    <icon-element name="options" />
                    <span>Опции</span>
                </div>
                <div class="option">
                    <router-custom-link-element to="/artists" class="link option__item" @click="action.removeArtist(artistData.id)"> {{ artistData.id === defaults.defaultArtistId ? 'Удалить треки' : 'Удалить артиста и треки' }} </router-custom-link-element>
                </div>
            </div>
        </dropdown-block>
    </transition>
    <ga-info-block :name="artistData.name" :total-duration="totalDuration" :track-count="trackIds.length" :image-ids="imageIds" />
    <modules-block position="content" />
    <div class="padd" v-if="allTrackIds.length">
        <track-widget-block v-for="trackId in trackIds" :key="trackId" :track-id="trackId" :track-list-ids="allTrackIds" />
    </div>
    <empty-block v-else />
</template>
<script setup>
import { computed, inject, nextTick, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { action, defaults } from '@repo'
import ModulesBlock from '@block/ModulesBlock.vue'
import DropdownBlock from '@block/DropdownBlock.vue'
import IconElement from '@element/IconElement.vue'
import FilterBlock from '@block/FilterBlock.vue'
import GaInfoBlock from '@block/GaInfoBlock.vue'
import TrackWidgetBlock from '@block/TrackWidgetBlock.vue'
import EmptyBlock from '@block/EmptyBlock.vue'
import RouterCustomLinkElement from '@element/RouterCustomLinkElement.vue'

const route = useRoute()
const router = useRouter()
const page = ref(1)

const artistData = computed(() => action.getArtistById(route.params?.artistId))
const allTrackIds = computed(() => action.getTrackListIdsByArtistId(artistData.value.id, selectedFilters.value.artistInfo.field, selectedFilters.value.artistInfo.direction))
const trackIds = computed(() => allTrackIds.value.slice(0, page.value * +import.meta.env.PLAYER_DEFAULT_ITEMS_LIMIT))
const totalDuration = computed(() => action.getTotalDurationByTrackIds(allTrackIds.value))
const imageIds = computed(() => action.getImageIdsByTrackIds(allTrackIds.value))

const filters = reactive([
    {
        name: 'По дате добавления',
        fieldName: 'addedAt',
    },
    {
        name: 'По алфавиту',
        fieldName: 'name',
    },
    {
        name: 'По длительности',
        fieldName: 'duration',
    },
])

const { menuDropdownPageName, title, selectedFilters, paginate, content } = inject('appState')

const paginatePage = newValue => {
    if (newValue) {
        nextTick(() => {
            if (trackIds.value.length) {
                if (content.value.scrollHeight <= content.value.scrollTop + content.value.offsetHeight + 130) {
                    page.value++

                    if (trackIds.value.length < allTrackIds.value.length) {
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

const setFilters = newSelectedFilters => {
    selectedFilters.value.artistInfo = newSelectedFilters
    menuDropdownPageName.value = ''
}

watch(paginate, paginatePage)

setFilters(
    selectedFilters.value?.artistInfo || {
        field: 'addedAt',
        direction: 'asc',
    },
)

watch(artistData, newValue => {
    if (!Object.keys(newValue).length) {
        router.push('/artists')
    }
})

title.value = 'Артист'
paginatePage(true)
</script>
