<template>
    <form autocomplete="off">
        <input-element v-model="data.emoji" label="Emoji" type="emoji" :error="emojiError" @remove-error="emojiError = ''" placeholder="😁" />
        <input-element v-model="data.name" label="Название" type="text" :error="nameError" @remove-error="nameError = ''" placeholder="Мой плейлист" />
    </form>
    <button-element type="accent" class="form-button" @click="save">
        <icon-element :name="$route.params?.playlistId ? 'refresh' : 'plus'" />
        <span>{{ $route.params?.playlistId ? 'Обновить' : 'Добавить' }}</span>
    </button-element>
</template>
<script setup>
import { ref } from 'vue'
import { action } from '@repo'
import ButtonElement from '@element/ButtonElement.vue'
import IconElement from '@element/IconElement.vue'
import InputElement from '@element/InputElement.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const emits = defineEmits(['saved'])

const data = ref(action.getPlaylistById(route.params?.playlistId) || { emoji: '', name: '' })
const emojiError = ref('')
const nameError = ref('')

const save = () => {
    if (!/\p{Emoji}/u.test(data.value.emoji)) {
        emojiError.value = 'Не верный символ!'
        return
    }

    if (data.value.name.length < 2 || data.value.name.length > 20) {
        nameError.value = 'От 2 до 20 символов!'
        return
    }

    const playlistCount = Object.keys(action.getPlaylistByName(name.value)).length

    if ((route.params?.playlistId && playlistCount > 1) || (!route.params?.playlistId && playlistCount === 1)) {
        nameError.value = 'Уже существует!'
        return
    }

    route.params?.playlistId ? action.updatePlaylist(route.params.playlistId, data.value) : action.addPlaylist(data.value)

    emits('saved')
}

defineOptions({
    inheritAttrs: false,
})
</script>
