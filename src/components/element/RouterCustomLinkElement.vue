<template>
    <router-link :to="to" :class="[$attrs?.class || 'link', $route.path.includes(to) && to !== '/' ? exactActiveClass : '']" :active-class="activeClass" :exact-active-class="exactActiveClass">
        <span class="link-click" @click="$emit('click', $event)"><slot></slot></span>
    </router-link>
</template>
<script setup>
defineProps({
    to: {
        type: String,
        required: true,
    },
    activeClass: {
        type: String,
        default: '',
    },
    exactActiveClass: {
        type: String,
        default: '',
    },
})

defineEmits(['click'])

defineOptions({
    inheritAttrs: false,
})
</script>
