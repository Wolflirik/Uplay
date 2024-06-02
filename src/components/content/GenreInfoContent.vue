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
        <dropdown-block v-if="menuDropdownPageName === 'genre-info' && selectedFilters?.genreInfo" trigger-element-id="menu-trigger" @close-dropdown="menuDropdownPageName = ''">
            <div class="dropdown__content-item">
                <div class="dropdown__title">
                    <icon-element name="filter" />
                    <span>Фильтр</span>
                </div>
                <filter-block :selected-direction="selectedFilters.genreInfo.direction" :selected-field="selectedFilters.genreInfo.field" :filters="filters" @filter="setFilters" />
            </div>
            <div class="dropdown__content-item">
                <div class="dropdown__title">
                    <icon-element name="options" />
                    <span>Опции</span>
                </div>
                <div class="option">
                    <router-custom-link-element to="/genres" class="link option__item" @click="action.removeGenre(genreData.id)"> {{ genreData.id === defaults.defaultGenreId ? 'Удалить треки' : 'Удалить жанр и треки' }} </router-custom-link-element>
                </div>
            </div>
        </dropdown-block>
    </transition>
    <ga-info-block :name="genreData.name" :total-duration="totalDuration" :track-count="allTrackIds.length" :image-ids="imageIds" />
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

const genreData = computed(() => action.getGenreById(route.params?.genreId))
const allTrackIds = computed(() => action.getTrackListIdsByGenreId(genreData.value.id, selectedFilters.value.genreInfo.field, selectedFilters.value.genreInfo.direction))
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
    selectedFilters.value.genreInfo = newSelectedFilters
    menuDropdownPageName.value = ''
}

watch(paginate, paginatePage)

setFilters(
    selectedFilters.value?.genreInfo || {
        field: 'addedAt',
        direction: 'asc',
    },
)

watch(genreData, newValue => {
    if (!Object.keys(genreData).length) {
        router.push('/genres')
    }
})

title.value = 'Жанр'
paginatePage(true)
</script>
