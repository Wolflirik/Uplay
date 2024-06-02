<template>
    <div class="form-group">
        <label :for="name" v-if="label.length" class="form-group__label">{{ label }}</label>
        <div class="form-group__wrap">
            <emoji-element v-if="type === 'emoji'" @select="value = $event" />
            <input :id="name" :type="type === 'emoji' ? 'text' : type" :class="`form-group__input form-group__input--type_${type}`" :value="value" @input="value = $event.target.value" :readonly="$attrs.readonly || type === 'emoji'" :placeholder="$attrs.placeholder" />
        </div>
        <span class="form-group__error" v-if="error.length">{{ error }}</span>
    </div>
</template>

<script setup>
import { hashCode } from '@utils/utils'
import EmojiElement from '@element/EmojiElement.vue'
import { computed } from 'vue'

const props = defineProps({
    label: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        default: 'text',
        validator(value) {
            return ['text', 'number', 'emoji'].includes(value)
        },
    },
    error: {
        type: String,
        default: '',
    },
    modelValue: {
        type: String,
        validator(value, props) {
            return (props.type === 'text' && typeof value === 'string') || (props.type === 'number' && typeof value === 'number') || (props.type === 'emoji' && typeof value === 'string')
        },
    },
})

const emits = defineEmits(['update:modelValue', 'removeError'])

const name = hashCode(props.label + props.type)

const value = computed({
    get: () => {
        return props.modelValue
    },
    set: val => {
        emits('removeError')
        emits('update:modelValue', val)
    },
})

defineOptions({
    inheritAttrs: false,
})
</script>
