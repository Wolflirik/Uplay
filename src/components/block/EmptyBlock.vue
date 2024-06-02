<template>
    <div class="empty">
        <slot>
            <icon-element name="clear-queue" />
            <span>Здесь еще нет аудиофайлов..</span>
        </slot>
    </div>
</template>
<script setup>
import IconElement from '@element/IconElement.vue'

defineOptions({
    inheritAttrs: false,
})
</script>
