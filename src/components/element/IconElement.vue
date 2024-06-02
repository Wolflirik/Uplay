<template>
    <svg class="icon" :class="$attrs.class" aria-hidden="true" v-if="name.length">
        <use :xlink:href="`#${name.toLowerCase()}`"></use>
    </svg>
</template>
<script setup>
defineProps({
    name: {
        type: String,
        default: '',
    },
})

defineOptions({
    inheritAttrs: false,
})
</script>
