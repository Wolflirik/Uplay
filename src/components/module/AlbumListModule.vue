<template>
    <div class="module" v-if="allAlbumListIds.length">
        <div class="module__head padd">
            <h2 class="module__title">{{ moduleTitle }}</h2>
            <div class="module__arrow-navigation" v-if="navVisibility">
                <button-element type="icon" :disabled="disablePrev" @click="navigate(0)">
                    <icon-element name="arrow-left-circle" />
                </button-element>
                <button-element type="icon" :disabled="disableNext" @click="navigate(1)">
                    <icon-element name="arrow-right-circle" />
                </button-element>
            </div>
        </div>
        <div class="module__content">
            <div class="module__scroll padd" :id="`scroll-album-${queryName}`" @scroll.passive="provideScrollParams">
                <album-widget-block v-for="albumId in albumListIds" :id="albumId" :key="albumId" :in-grid="false" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, inject, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { action } from '@repo'
import AlbumWidgetBlock from '@block/AlbumWidgetBlock.vue'
import ButtonElement from '@element/ButtonElement.vue'
import IconElement from '@element/IconElement.vue'

const route = useRoute()

const moduleTitle = ref('Новые альбомы')
const page = ref(1)
const modulePaginate = ref(false)
const navVisibility = ref(false)
const disableNext = ref(true)
const disablePrev = ref(false)

const { innerWidth } = inject('appState')

let queryName = 'getAlbumListIds'
let id = false

if (route.params?.artistId) {
    queryName = 'getAlbumListIdsByArtistId'
    moduleTitle.value = 'Альбомы артиста'
    id = route.params?.artistId
} else if (route.params?.genreId) {
    queryName = 'getAlbumListIdsByGenreId'
    moduleTitle.value = 'Альбомы жанра'
    id = route.params?.genreId
}

const allAlbumListIds = computed(() => (id ? action[queryName](id, 'addedAt', 'asc') : action[queryName]('addedAt', 'asc')))
const albumListIds = computed(() => allAlbumListIds.value.slice(0, page.value * +import.meta.env.PLAYER_DEFAULT_MODULE_ITEMS_LIMIT))

const provideScrollParams = function (e) {
    modulePaginate.value = e?.target.scrollWidth <= e?.target.scrollLeft + e?.target.offsetWidth + 360

    checkNextVisibility()
    checkPrevVisibility()
}

const paginatePage = newValue => {
    if (newValue) {
        nextTick(() => {
            if (albumListIds.value.length) {
                const container = document.getElementById(`scroll-album-${queryName}`)

                if (container.scrollWidth <= container.scrollLeft + container.offsetWidth + 360) {
                    page.value++

                    if (albumListIds.value.length < allAlbumListIds.value.length) {
                        paginatePage(true)
                    }
                } else {
                    checkNavigationNeed()
                    modulePaginate.value = false
                }
            } else {
                page.value++
            }
        })
    }
}

const navigate = (vector = 1) => {
    const container = document.getElementById(`scroll-album-${queryName}`)
    const itemWidth = container.children[0].offsetWidth
    const scrollLeft = vector ? container.scrollLeft + itemWidth : container.scrollLeft - itemWidth

    container.scrollTo({
        behavior: 'smooth',
        left: scrollLeft,
    })
}

const checkNavigationNeed = () => {
    const container = document.getElementById(`scroll-album-${queryName}`)
    navVisibility.value = container.offsetWidth < container.scrollWidth

    checkNextVisibility()
    checkPrevVisibility()
}

const checkNextVisibility = () => {
    const container = document.getElementById(`scroll-album-${queryName}`)
    disableNext.value = container.scrollLeft + container.offsetWidth === container.scrollWidth
}

const checkPrevVisibility = () => {
    const container = document.getElementById(`scroll-album-${queryName}`)
    disablePrev.value = container.scrollLeft === 0
}

watch(modulePaginate, paginatePage)
watch(innerWidth, checkNavigationNeed)
paginatePage(true)
</script>
