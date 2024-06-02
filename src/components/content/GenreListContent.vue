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
        <dropdown-block v-if="menuDropdownPageName === 'genre-list' && selectedFilters?.genreList" trigger-element-id="menu-trigger" @close-dropdown="menuDropdownPageName = ''">
            <div class="dropdown__content-item">
                <div class="dropdown__title">
                    <icon-element name="filter" />
                    <span>Фильтр</span>
                </div>
                <filter-block :selected-direction="selectedFilters.genreList.direction" :selected-field="selectedFilters.genreList.field" :filters="filters" @filter="setFilters" />
            </div>
        </dropdown-block>
    </transition>
    <div class="grid">
        <div class="col col--12 col--sm-6 col--lg-4 col--xxl-3" v-for="genreId in genreIds" :key="genreId">
            <ga-widget-block :id="genreId" :in-grid="true" type="genre" />
        </div>
    </div>
</template>
<script setup>
import { computed, inject, nextTick, reactive, ref, watch } from 'vue'
import { action } from '@repo'
import GaWidgetBlock from '@block/GaWidgetBlock.vue'
import DropdownBlock from '@block/DropdownBlock.vue'
import FilterBlock from '@block/FilterBlock.vue'
import IconElement from '@element/IconElement.vue'

const page = ref(1)

const allGenreIds = computed(() => action.getGenreListIds(selectedFilters.value.genreList.field, selectedFilters.value.genreList.direction))
const genreIds = computed(() => allGenreIds.value.slice(0, page.value * +import.meta.env.PLAYER_DEFAULT_ITEMS_LIMIT))
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
            if (genreIds.value.length) {
                if (content.value.scrollHeight <= content.value.scrollTop + content.value.offsetHeight + 130) {
                    page.value++

                    if (genreIds.value.length < allGenreIds.value.length) {
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
    selectedFilters.value.genreList = newSelectedFilters
    menuDropdownPageName.value = ''
}

watch(paginate, paginatePage)

setFilters(
    selectedFilters.value?.genreList || {
        field: 'addedAt',
        direction: 'asc',
    },
)

title.value = 'Жанры'
paginatePage(true)
</script>
