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
        <dropdown-block v-if="menuDropdownPageName === 'album-list' && selectedFilters?.albumList" trigger-element-id="menu-trigger" @close-dropdown="menuDropdownPageName = ''">
            <div class="dropdown__content-item">
                <div class="dropdown__title">
                    <icon-element name="filter" />
                    <span>Фильтр</span>
                </div>
                <filter-block :selected-direction="selectedFilters.albumList.direction" :selected-field="selectedFilters.albumList.field" :filters="filters" @filter="setFilters" />
            </div>
        </dropdown-block>
    </transition>
    <div class="grid">
        <div class="col col--12 col--sm-6 col--lg-4 col--xxl-3" v-for="albumId in albumListIds" :key="albumId">
            <album-widget-block :id="albumId" :in-grid="true" />
        </div>
    </div>
</template>
<script setup>
import { computed, inject, nextTick, reactive, ref, watch } from 'vue'
import { action } from '@repo'
import AlbumWidgetBlock from '@block/AlbumWidgetBlock.vue'
import DropdownBlock from '@block/DropdownBlock.vue'
import FilterBlock from '@block/FilterBlock.vue'
import IconElement from '@element/IconElement.vue'

const page = ref(1)

const allAlbumListIds = computed(() => action.getAlbumListIds(selectedFilters.value.albumList.field, selectedFilters.value.albumList.direction))
const albumListIds = computed(() => allAlbumListIds.value.slice(0, page.value * +import.meta.env.PLAYER_DEFAULT_ITEMS_LIMIT))

const filters = reactive([
    {
        name: 'По дате добавления',
        fieldName: 'addedAt',
    },
    {
        name: 'По алфавиту',
        fieldName: 'title',
    },
])

const { menuDropdownPageName, title, selectedFilters, paginate, content } = inject('appState')

const paginatePage = newValue => {
    if (newValue) {
        nextTick(() => {
            if (albumListIds.value.length) {
                if (content.value.scrollHeight <= content.value.scrollTop + content.value.offsetHeight + 130) {
                    page.value++

                    if (albumListIds.value.length < allAlbumListIds.value.length) {
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
    selectedFilters.value.albumList = newSelectedFilters
    menuDropdownPageName.value = ''
}

watch(paginate, paginatePage)

setFilters(
    selectedFilters.value?.albumList || {
        field: 'addedAt',
        direction: 'asc',
    },
)

title.value = 'Альбомы'
paginatePage(true)
</script>
