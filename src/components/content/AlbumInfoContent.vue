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
        <dropdown-block v-if="menuDropdownPageName === 'album-info' && selectedFilters?.albumInfo" trigger-element-id="menu-trigger" @close-dropdown="menuDropdownPageName = ''">
            <div class="dropdown__content-item">
                <div class="dropdown__title">
                    <icon-element name="filter" />
                    <span>Фильтр</span>
                </div>
                <filter-block :selected-direction="selectedFilters.albumInfo.direction" :selected-field="selectedFilters.albumInfo.field" :filters="filters" @filter="setFilters" />
            </div>
            <div class="dropdown__content-item">
                <div class="dropdown__title">
                    <icon-element name="options" />
                    <span>Опции</span>
                </div>
                <div class="option">
                    <router-custom-link-element to="/albums" class="link option__item" @click="action.removeAlbum(albumData.id)"> {{ albumData.id === defaults.defaultAlbumId ? 'Удалить треки' : 'Удалить альбом и треки' }} </router-custom-link-element>
                </div>
            </div>
        </dropdown-block>
    </transition>
    <album-info-block :title="albumData.title" :total-duration="totalDuration" :track-count="trackIds.length" :image-id="imageId" :artist-list-ids="artistListIds" :year="year" />

    <div class="padd" v-if="allTrackIds.length">
        <track-widget-block v-for="trackId in trackIds" :key="trackId" :track-id="trackId" :track-list-ids="allTrackIds" />
    </div>
    <empty-block v-else />
</template>
<script setup>
import { computed, inject, nextTick, reactive, ref, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { action, defaults } from '@repo'
import AlbumInfoBlock from '@block/AlbumInfoBlock.vue'
import DropdownBlock from '@block/DropdownBlock.vue'
import FilterBlock from '@block/FilterBlock.vue'
import TrackWidgetBlock from '@block/TrackWidgetBlock.vue'
import IconElement from '@element/IconElement.vue'
import EmptyBlock from '@block/EmptyBlock.vue'
import RouterCustomLinkElement from '@element/RouterCustomLinkElement.vue'

const route = useRoute()
const router = useRouter()
const page = ref(1)

const albumData = computed(() => action.getAlbumById(route.params?.albumId))
const allTrackIds = computed(() => action.getTrackListIdsByAlbumId(albumData.value.id, selectedFilters.value.albumInfo.field, selectedFilters.value.albumInfo.direction))
const trackIds = computed(() => allTrackIds.value.slice(0, page.value * +import.meta.env.PLAYER_DEFAULT_ITEMS_LIMIT))
const imageId = computed(() => action.getImageIdByTrackIds(allTrackIds.value))
const year = computed(() => action.getYearByTrackIds(allTrackIds.value))
const artistListIds = computed(() => action.getArtistIdsByTrackIds(allTrackIds.value))
const totalDuration = computed(() => action.getTotalDurationByTrackIds(allTrackIds.value))
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
    selectedFilters.value.albumInfo = newSelectedFilters
    menuDropdownPageName.value = ''
}

watch(paginate, paginatePage)

setFilters(
    selectedFilters.value?.albumInfo || {
        field: 'addedAt',
        direction: 'asc',
    },
)

watch(albumData, newValue => {
    if (!Object.keys(newValue).length) {
        router.push('/albums')
    }
})

title.value = 'Альбом'
paginatePage(true)
</script>
