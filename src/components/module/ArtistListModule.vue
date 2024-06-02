<template>
    <div class="module" v-if="allArtistListIds.length">
        <div class="module__head padd">
            <h2 class="module__title">Новые артисты</h2>
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
            <div class="module__scroll padd" :id="`scroll-artist`" @scroll.passive="provideScrollParams">
                <ga-widget-block v-for="artistId in artistListIds" :id="artistId" :key="artistId" :in-grid="false" type="artist" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, inject, nextTick, ref, watch } from 'vue'
import { action } from '@repo'
import GaWidgetBlock from '@block/GaWidgetBlock.vue'
import ButtonElement from '@element/ButtonElement.vue'
import IconElement from '@element/IconElement.vue'

const page = ref(1)
const modulePaginate = ref(false)
const navVisibility = ref(false)
const disableNext = ref(true)
const disablePrev = ref(false)

const { innerWidth } = inject('appState')

const allArtistListIds = computed(() => action.getArtistListIds('addedAt', 'asc'))
const artistListIds = computed(() => allArtistListIds.value.slice(0, page.value * +import.meta.env.PLAYER_DEFAULT_MODULE_ITEMS_LIMIT))

const provideScrollParams = function (e) {
    modulePaginate.value = e?.target.scrollWidth <= e?.target.scrollLeft + e?.target.offsetWidth + 360

    checkNextVisibility()
    checkPrevVisibility()
}

const paginatePage = newValue => {
    if (newValue) {
        nextTick(() => {
            if (artistListIds.value.length) {
                const container = document.getElementById(`scroll-artist`)

                if (container.scrollWidth <= container.scrollLeft + container.offsetWidth + 360) {
                    page.value++

                    if (artistListIds.value.length < allArtistListIds.value.length) {
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
    const container = document.getElementById(`scroll-artist`)
    const itemWidth = container.children[0].offsetWidth
    const scrollLeft = vector ? container.scrollLeft + itemWidth : container.scrollLeft - itemWidth

    container.scrollTo({
        behavior: 'smooth',
        left: scrollLeft,
    })
}

const checkNavigationNeed = () => {
    const container = document.getElementById(`scroll-artist`)
    navVisibility.value = container.offsetWidth < container.scrollWidth

    checkNextVisibility()
    checkPrevVisibility()
}

const checkNextVisibility = () => {
    const container = document.getElementById(`scroll-artist`)
    disableNext.value = container.scrollLeft + container.offsetWidth === container.scrollWidth
}

const checkPrevVisibility = () => {
    const container = document.getElementById(`scroll-artist`)
    disablePrev.value = container.scrollLeft === 0
}

watch(modulePaginate, paginatePage)
watch(innerWidth, checkNavigationNeed)
paginatePage(true)
</script>
