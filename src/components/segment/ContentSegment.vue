<template>
    <main class="content" ref="content" @scroll.passive="provideScrollParams">
        <router-view />
    </main>
</template>
<script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { paginate, contentScrollTop, content } = inject('appState')
const provideScrollParams = function (e) {
    contentScrollTop.value = e?.target.scrollTop
    paginate.value = e?.target.scrollHeight <= e?.target.scrollTop + e?.target.clientHeight + 130
}

router.beforeResolve(() => {
    content.value.scrollTop = 0
})
</script>
