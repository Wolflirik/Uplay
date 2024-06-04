<template>
    <div class="album-info">
        <image-element class="album-info__image-back-blurred" :image-id="imageId" :alt="title" />
        <div class="grid padd">
            <div class="col col--12 col--md-5 col--lg-5 col--xl-4 col--xxl-3">
                <image-element class="album-info__image" :image-id="imageId" :alt="title" />
            </div>
            <div class="col col--12 col--md-7 col--lg-7 col--xl-8 col--xxl-9">
                <div class="album-info__description">
                    <h1 class="album-info__title" ref="titleElement">{{ title }}</h1>
                    <span class="album-info__description-item">
                        <span class="album-info__description-item-key">Колтчество треков: </span>
                        <span class="album-info__description-item-value">{{ trackCount }}</span>
                    </span>
                    <span v-if="+year" class="album-info__description-item">
                        <span class="album-info__description-item-key">Год создания: </span>
                        <span class="album-info__description-item-value">{{ year }}</span>
                    </span>
                    <span class="album-info__description-item">
                        <span class="album-info__description-item-key">Длительность: </span>
                        <span class="album-info__description-item-value">{{ (totalDuration / 60).toFixed(0) + ' ' + declOfNum((totalDuration / 60).toFixed(0), ['минута', 'минуты', 'минут']) }}</span>
                    </span>
                    <div class="album-info__artist">
                        <h2 class="album-info__artist-title">Исполнител{{ artistListIds.length > 1 ? 'и' : 'ь' }}</h2>
                        <div class="album-info__artist-list">
                            <div class="album-info__artist-list-inner">
                                <artist-widget-block v-for="artistId in artistListIds" :key="artistId" :artist-id="artistId" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { declOfNum } from '@utils/utils'
import ImageElement from '@element/ImageElement.vue'
import ArtistWidgetBlock from '@block/ArtistWidgetBlock.vue'

defineProps({
    title: {
        type: String,
        default: '',
    },
    imageId: {
        type: String,
        default: '',
    },
    trackCount: {
        type: Number,
        default: '',
    },
    year: {
        type: String,
        default: '',
    },
    totalDuration: {
        type: Number,
        default: 0,
    },
    artistListIds: {
        type: Array,
        default: [],
        validator(value) {
            return value instanceof Array
        },
    },
})

defineOptions({
    inheritAttrs: false,
})
</script>
