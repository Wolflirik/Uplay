<template>
    <modules-block position="content" />
    <div><button @click="uploadTracks">upload</button></div>
    <dropdown-block v-if="menuDropdownPageName === 'playlist-list'" trigger-element-id="menu-trigger" @close-dropdown="menuDropdownPageName = ''"> test test </dropdown-block>
</template>
<script setup>
import { getFilesFromDirectory } from '@utils/fileLoader'
import { action } from '@repo'
import { parseMetadata } from '@utils/metadataParser'
import DropdownBlock from '@block/DropdownBlock.vue'
import { inject } from 'vue'
import ModulesBlock from '@block/ModulesBlock.vue'

const { menuDropdownPageName } = inject('appState')

const uploadTracks = async () => {
    const files = await getFilesFromDirectory(import.meta.env.PLAYER_ALLOWED_TRACK_EXTENSIONS.split(' '))
    try {
        action.setSetting('loading', true)
        await parseMetadata(files).then(action.fillTrackList)
        action.setSetting('loading', false)
    } catch (e) {
        alert(e)
    }
}
</script>
