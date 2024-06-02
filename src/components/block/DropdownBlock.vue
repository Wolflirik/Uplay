<template>
    <div class="dropdown" :style="`--positioning: ${positioning};--position-abscissa:${positionAbscissa}px; --position-ordinate-inverted:${positionOrdinateInverted}px;`">
        <div class="dropdown__back" @click="closeDropdown"></div>
        <div class="dropdown__main" v-click-outside-element="closeDropdown">
            <div class="dropdown__inner">
                <div class="dropdown__content">
                    <slot></slot>
                </div>
                <div class="dropdown__footer">
                    <button-element type="link" class="dropdown__footer-button" @click="closeDropdown">Закрыть</button-element>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { inject, ref, watch } from 'vue'
import ButtonElement from '@element/ButtonElement.vue'

const props = defineProps({
    triggerElementId: {
        type: String,
        default: '',
    },
})

const emits = defineEmits(['closeDropdown'])

const { contentScrollTop } = inject('appState')

const positioning = ref('absolute')
const positionAbscissa = ref(0)
const positionOrdinateInverted = ref(0)

if (props.triggerElementId.length) {
    const { top, right } = document.getElementById(`${props.triggerElementId}`)?.getBoundingClientRect() || { top: 0, right: 0 }

    positioning.value = 'fixed'
    positionAbscissa.value = top
    positionOrdinateInverted.value = window.innerWidth - right
}

const closeDropdown = () => {
    emits('closeDropdown')
}

watch(contentScrollTop, closeDropdown)
</script>
