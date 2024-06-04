import '@style/main.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
import { createORM } from 'pinia-orm'
// деструктуризация проксируемых обьектов
import { clone } from 'pouchdb-utils'
// IndexedDb
import localforage from 'localforage'
import App from './App.vue'
import router from './router'
import vueClickOutsideElement from 'vue-click-outside-element'
import Vue3TouchEvents from 'vue3-touch-events'

const app = createApp(App)

const pinia = createPinia()
const piniaOrm = createORM()

localforage.config({
    name: 'player_data',
    storeName: 'db',
})

const persistedState = createPersistedStatePlugin({
    storage: {
        getItem: async key => {
            return await localforage.getItem(key)
        },
        setItem: async (key, value) => {
            return await localforage.setItem(key, value)
        },
        removeItem: async key => {
            return await localforage.removeItem(key)
        },
    },
    serialize: value => {
        return clone(value)
    },
    deserialize: value => {
        return value
    },

    overwrite: true,
    persist: true,
})

pinia.use(piniaOrm).use(persistedState)
app.use(pinia).use(router).use(vueClickOutsideElement).use(Vue3TouchEvents)

app.mount('#app')
