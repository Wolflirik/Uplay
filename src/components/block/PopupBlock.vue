<template>
    <div class="popup" v-touch:swipe.bottom="() => $emit('closePopup')">
        <div class="popup__back" @click="() => $emit('closePopup')"></div>
        <div class="popup__main" v-click-outside-element="() => $emit('closePopup')">
            <div class="popup__inner">
                <div class="popup__content">
                    <button-element type="icon" class="popup__close-button" @click="$emit('closePopup')">
                        <icon-element name="minus" />
                    </button-element>
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import ButtonElement from '@element/ButtonElement.vue'
import IconElement from '@element/IconElement.vue'

defineEmits(['closePopup'])

defineOptions({
    inheritAttrs: false,
})
</script>
