<template>
    <div class="image-grid" :class="[`image-grid--count_${imageIds.length}`, $attrs.class]">
        <div class="image-grid__item" v-for="imageId in imageIds">
            <image-element class="image-grid__image" :image-id="imageId" />
        </div>
    </div>
</template>
<script setup>
import ImageElement from '@element/ImageElement.vue'

defineProps({
    imageIds: {
        type: Array,
        required: true,
    },
})
</script>
