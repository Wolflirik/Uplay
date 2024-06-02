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
        <dropdown-block v-if="menuDropdownPageName === 'playlist-list' && selectedFilters?.playlistList" trigger-element-id="menu-trigger" @close-dropdown="menuDropdownPageName = ''">
            <div class="dropdown__content-item">
                <div class="dropdown__title">
                    <icon-element name="filter" />
                    <span>Фильтр</span>
                </div>
                <filter-block :selected-direction="selectedFilters.playlistList.direction" :selected-field="selectedFilters.playlistList.field" :filters="filters" @filter="setFilters" />
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
                        @click="
                            () => {
                                menuDropdownPageName = ''
                                showForm = true
                            }
                        "
                    >
                        Создать плейлист
                    </button-element>
                </div>
            </div>
        </dropdown-block>
    </transition>
    <transition name="popup" enter-active-class="popup--animation_active" enter-from-class="popup--animation_active-from" enter-to-class="popup--animation_active-to" leave-active-class="popup--animation_leave" leave-from-class="popup--animation_leave-from" leave-to-class="popup--animation_leave-to">
        <popup-block v-if="showForm" @close-popup="showForm = false">
            <playlist-form @saved="showForm = false" />
        </popup-block>
    </transition>
    <div class="grid">
        <div class="col col--12 col--sm-6 col--lg-4 col--xxl-3" v-for="playlistId in playlistIds" :key="playlistId">
            <playlist-widget-block :id="playlistId" :in-grid="true" />
        </div>
    </div>
</template>
<script setup>
import { computed, inject, nextTick, reactive, ref, watch } from 'vue'
import { action } from '@repo'
import PlaylistWidgetBlock from '@block/PlaylistWidgetBlock.vue'
import DropdownBlock from '@block/DropdownBlock.vue'
import FilterBlock from '@block/FilterBlock.vue'
import IconElement from '@element/IconElement.vue'
import ButtonElement from '@element/ButtonElement.vue'
import PopupBlock from '@block/PopupBlock.vue'
import PlaylistForm from '@form/PlaylistForm.vue'

const page = ref(1)
const showForm = ref(false)

const allPlaylistIds = computed(() => action.getPlaylistListIds(selectedFilters.value.playlistList.field, selectedFilters.value.playlistList.direction))
const playlistIds = computed(() => allPlaylistIds.value.slice(0, page.value * +import.meta.env.PLAYER_DEFAULT_ITEMS_LIMIT))
const filters = reactive([
    {
        name: 'По дате добавления',
        fieldName: 'addedAt',
    },
    {
        name: 'По алфавиту',
        fieldName: 'name',
    },
])

const { menuDropdownPageName, title, selectedFilters, paginate, content } = inject('appState')

const paginatePage = newValue => {
    if (newValue) {
        nextTick(() => {
            if (playlistIds.value.length) {
                if (content.value.scrollHeight <= content.value.scrollTop + content.value.offsetHeight + 130) {
                    page.value++

                    if (playlistIds.value.length < allPlaylistIds.value.length) {
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
    selectedFilters.value.playlistList = newSelectedFilters
    menuDropdownPageName.value = ''
}

watch(paginate, paginatePage)

setFilters(
    selectedFilters.value?.playlistList || {
        field: 'addedAt',
        direction: 'asc',
    },
)

title.value = 'Плейлисты'
paginatePage(true)
</script>
