<template>
    <sprite-block />
    <div class="layout" :class="`layout--name_${layoutName}`" :style="`--vh-unit:${vhUnit}px`">
        <loader-segment v-if="!loadedStorage" @fully-loaded="loadedStorage = true" class="layout__loader" />
        <template v-else>
            <segment-block />
        </template>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, provide, ref } from 'vue'
import { getLayoutName } from '@utils/componentLoader'
import SegmentBlock from '@block/SegmentBlock.vue'
import LoaderSegment from '@segment/LoaderSegment.vue'
import SpriteBlock from '@block/SpriteBlock.vue'

const loadedStorage = ref(false)
const vhUnit = ref(0)
const innerWidth = ref(0)
const menuDropdownPageName = ref('')
const deferredPrompt = ref(null)

provide('appState', {
    title: ref(''),
    innerWidth: innerWidth,
    menuDropdownPageName: menuDropdownPageName,
    selectedFilters: ref({}),
    paginate: ref(false),
    contentScrollTop: ref(0),
    content: ref(null),
    deferredPrompt: deferredPrompt,
})

const provideWindowParams = () => {
    vhUnit.value = window.innerHeight * 0.01
    innerWidth.value = window.innerWidth
    menuDropdownPageName.value = ''
}

const checkPWA = function (e) {
    e.preventDefault()
    deferredPrompt.value = e
}

window.addEventListener('beforeinstallprompt', checkPWA)

provideWindowParams()

onMounted(async () => {
    window.addEventListener('resize', provideWindowParams, {
        passive: true,
    })
})

onUnmounted(() => {
    window.removeEventListener('resize', provideWindowParams)
})

const layoutName = getLayoutName(innerWidth)
</script>
