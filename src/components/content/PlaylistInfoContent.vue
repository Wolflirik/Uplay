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
        <dropdown-block v-if="menuDropdownPageName === 'playlist-info' && selectedFilters?.playlistInfo" trigger-element-id="menu-trigger" @close-dropdown="menuDropdownPageName = ''">
            <div class="dropdown__content-item" v-if="allTrackIds.length">
                <div class="dropdown__title">
                    <icon-element name="filter" />
                    <span>Фильтр</span>
                </div>
                <filter-block :selected-direction="selectedFilters.playlistInfo.direction" :selected-field="selectedFilters.playlistInfo.field" :filters="filters" @filter="setFilters" />
            </div>
            <div class="dropdown__content-item">
                <div class="dropdown__title">
                    <icon-element name="options" />
                    <span>Опции</span>
                </div>
                <div class="option">
                    <button-element
                        type="link"
                        class="option__item"
                        v-if="playlistData.id !== defaults.favoritePlaylistId"
                        @click="
                            () => {
                                menuDropdownPageName = ''
                                showForm = true
                            }
                        "
                        >Редактировать плейлист</button-element
                    >
                    <router-custom-link-element to="/playlists" class="link option__item" @click="action.removePlaylist(playlistData.id)"> {{ playlistData.id === defaults.favoritePlaylistId ? 'Удалить треки' : 'Удалить плейлист и треки' }} </router-custom-link-element>
                </div>
            </div>
        </dropdown-block>
    </transition>
    <transition name="popup" enter-active-class="popup--animation_active" enter-from-class="popup--animation_active-from" enter-to-class="popup--animation_active-to" leave-active-class="popup--animation_leave" leave-from-class="popup--animation_leave-from" leave-to-class="popup--animation_leave-to">
        <popup-block v-if="showForm" @close-popup="showForm = false">
            <playlist-form @saved="showForm = false" />
        </popup-block>
    </transition>
    <ga-info-block :name="playlistData.name" :total-duration="totalDuration" :track-count="allTrackIds.length" :image-ids="imageIds" />
    <div class="padd" v-if="allTrackIds.length">
        <track-widget-block v-for="trackId in trackIds" :key="trackId" :track-id="trackId" :track-list-ids="allTrackIds" />
    </div>
    <empty-block v-else />
</template>
<script setup>
import { computed, inject, nextTick, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { action, defaults } from '@repo'
import DropdownBlock from '@block/DropdownBlock.vue'
import IconElement from '@element/IconElement.vue'
import FilterBlock from '@block/FilterBlock.vue'
import GaInfoBlock from '@block/GaInfoBlock.vue'
import TrackWidgetBlock from '@block/TrackWidgetBlock.vue'
import RouterCustomLinkElement from '@element/RouterCustomLinkElement.vue'
import EmptyBlock from '@block/EmptyBlock.vue'
import ButtonElement from '@element/ButtonElement.vue'
import PlaylistForm from '@form/PlaylistForm.vue'
import PopupBlock from '@block/PopupBlock.vue'

const route = useRoute()
const router = useRouter()
const page = ref(1)
const showForm = ref(false)

const playlistData = computed(() => action.getPlaylistById(route.params?.playlistId))
const allTrackIds = computed(() => action.getTrackListIdsByPlaylistId(playlistData.value.id, selectedFilters.value.playlistInfo.field, selectedFilters.value.playlistInfo.direction))
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
        // page.value++
        // paginate.value = false

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
    selectedFilters.value.playlistInfo = newSelectedFilters
    menuDropdownPageName.value = ''
}

watch(paginate, paginatePage)

setFilters(
    selectedFilters.value?.playlistInfo || {
        field: 'addedAt',
        direction: 'asc',
    },
)

watch(playlistData, newValue => {
    if (!Object.keys(newValue).length) {
        router.push('/playlists')
    }
})

title.value = 'Плейлист'
paginatePage(true)
</script>
