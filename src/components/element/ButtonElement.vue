<template>
    <button class="button" :class="[$attrs.class, `button--type_${type}`, loading ? 'button--status_loading' : 'button--status_stable']" :id="$attrs.id" @click="$emit('click', $event)" :disabled="disabled || loading" :hidden="hidden">
        <slot></slot>
    </button>
</template>
<script setup>
import { computed, useAttrs } from 'vue'

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

const attrs = useAttrs()

const disabled = computed(() => {
    if (attrs.hasOwnProperty('disabled')) {
        if (attrs.disabled === '') return true
        else return attrs.disabled
    }

    return false
})

const hidden = computed(() => {
    if (attrs.hasOwnProperty('hidden')) {
        if (attrs.hidden === '') return false
        else return attrs.hidden
    }

    return false
})

defineEmits(['click'])

defineOptions({
    inheritAttrs: false,
})
</script>
