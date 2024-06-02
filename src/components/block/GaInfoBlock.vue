<template>
    <div class="ga-info">
        <div class="grid padd">
            <div class="col col--12 col--md-3 col--lg-3 col--xl-2 col--xxl-1">
                <image-grid-element :image-ids="imageIds" class="ga-info__image" />
            </div>
            <div class="col col--12 col--md-9 col--lg-9 col--xl-10 col--xxl-11">
                <div class="ga-info__description">
                    <h1 class="ga-info__name">{{ name }}</h1>
                    <span class="ga-info__description-item">
                        <span class="ga-info__description-item-key">Колтчество треков: </span>
                        <span class="ga-info__description-item-value">{{ trackCount }}</span>
                    </span>
                    <span class="ga-info__description-item">
                        <span class="ga-info__description-item-key">Длительность: </span>
                        <span class="ga-info__description-item-value">{{ (totalDuration / 60).toFixed(0) + ' ' + declOfNum((totalDuration / 60).toFixed(0), ['минута', 'минуты', 'минут']) }}</span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { declOfNum } from '@utils/utils'
import ImageGridElement from '@element/ImageGridElement.vue'

defineProps({
    name: {
        type: String,
        default: '',
    },
    imageIds: {
        type: Array,
        default: [],
        validator(value) {
            return value instanceof Array
        },
    },
    trackCount: {
        type: Number,
        default: 0,
    },
    totalDuration: {
        type: Number,
        default: 0,
    },
})

defineOptions({
    inheritAttrs: false,
})
</script>
