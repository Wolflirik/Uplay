<template>
    <button-element type="icon" @click="menuDropdownPageName = $route.name" id="menu-trigger">
        <icon-element name="menu" />
    </button-element>
</template>
<script setup>
import { inject } from 'vue'
import ButtonElement from '@element/ButtonElement.vue'
import IconElement from '@element/IconElement.vue'

const { menuDropdownPageName } = inject('appState')
</script>
