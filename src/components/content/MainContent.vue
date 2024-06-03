<template>
    <div class="hello">
        <div class="hello__info padd">
            <h1 class="hello__title">UPLAY</h1>
            <p class="hello__description">Если музыка твой выбор, пусть так будет, вне зависимости от платформы и скорости интернета!</p>
            <div class="hello__action-buttons">
                <button-element type="accent" @click="uploadTracks" :disabled="parseLoading">
                    <icon-element :name="parseLoading ? 'loader' : 'plus'" :class="{ 'icon--animation_loading': parseLoading }" />
                    <span>Выбрать треки</span>
                </button-element>
                <button-element type="default" @click="installPWA" :hidden="!deferredPrompt">
                    <icon-element name="install" />
                    <span>Установить</span>
                </button-element>
            </div>
        </div>
    </div>
    <modules-block position="content" v-if="allTrackCount" />
    <empty-block v-else />
</template>
<script setup>
import { computed, inject, ref } from 'vue'
import { getFilesFromDirectory } from '@utils/fileLoader'
import { action } from '@repo'
import { parseMetadata } from '@utils/metadataParser'
import ModulesBlock from '@block/ModulesBlock.vue'
import ButtonElement from '@element/ButtonElement.vue'
import IconElement from '@element/IconElement.vue'
import EmptyBlock from '@block/EmptyBlock.vue'

document.title = 'Uplay'

const parseLoading = ref(false)

const { deferredPrompt } = inject('appState')

const uploadTracks = async () => {
    const files = await getFilesFromDirectory(import.meta.env.PLAYER_ALLOWED_TRACK_EXTENSIONS.split(' '))
    try {
        parseLoading.value = true
        const filesMeta = await parseMetadata(files)
        action.fillTrackList(filesMeta)
    } catch (e) {
    } finally {
        parseLoading.value = false
    }
}

const installPWA = async () => {
    if (!deferredPrompt.value) {
        return
    }

    deferredPrompt.value.prompt()
}

const allTrackCount = computed(() => action.getAllTrackCount())
</script>
