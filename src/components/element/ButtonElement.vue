<template>
    <button class="button" :class="[$attrs.class, `button--type_${type}`, loading ? 'button--status_loading' : 'button--status_stable']" :id="$attrs.id" @click="$emit('click', $event)" :disabled="$attrs.disabled || loading" :hidden="$attrs.hidden">
        <slot></slot>
    </button>
</template>
<script setup>
defineProps({
    type: {
        type: String,
        default: 'default',
        validator(value) {
            return ['accent', 'default', 'icon', 'link', 'emoji'].includes(value)
        },
    },

    loading: {
        type: Boolean,
        default: false,
    },
})

defineEmits(['click'])

defineOptions({
    inheritAttrs: false,
})
</script>
