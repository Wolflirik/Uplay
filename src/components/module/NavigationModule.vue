<template>
    <nav class="navigation padd" :class="$attrs.class">
        <router-custom-link-element to="/genres" active-class="navigation__link--status_active" exact-active-class="navigation__link--status_active" class="navigation__link">
            <icon-element name="note" class="navigation__link-icon" />
            <span class="navigation__link-caption">Жанры</span>
        </router-custom-link-element>
        <router-custom-link-element to="/albums" active-class="navigation__link--status_active" exact-active-class="navigation__link--status_active" class="navigation__link">
            <icon-element name="note-square" class="navigation__link-icon" />
            <span class="navigation__link-caption">Альбомы</span>
        </router-custom-link-element>
        <router-custom-link-element to="/artists" active-class="navigation__link--status_active" exact-active-class="navigation__link--status_active" class="navigation__link">
            <icon-element name="users" class="navigation__link-icon" />
            <span class="navigation__link-caption">Артисты</span>
        </router-custom-link-element>
        <router-custom-link-element to="/playlists" active-class="navigation__link--status_active" exact-active-class="navigation__link--status_active" class="navigation__link">
            <icon-element name="music-library" class="navigation__link-icon" />
            <span class="navigation__link-caption">Плейлисты</span>
        </router-custom-link-element>
    </nav>
</template>
<script setup>
import IconElement from '@element/IconElement.vue'
import RouterCustomLinkElement from '@element/RouterCustomLinkElement.vue'
</script>
