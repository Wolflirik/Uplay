<template>
    <button-element type="icon" class="back-button" @click="$router.push($route.path.substring(0, $route.path.lastIndexOf('/')) || '/')">
        <icon-element name="arrow-left" />
    </button-element>
</template>
<script setup>
import ButtonElement from '@element/ButtonElement.vue'
import IconElement from '@element/IconElement.vue'
</script>
