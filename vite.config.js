import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import svgLoader from 'vite-svg-loader'
import { VitePWA } from 'vite-plugin-pwa'
import ViteSvgSpriteWrapper from 'vite-svg-sprite-wrapper'
import Unfonts from 'unplugin-fonts/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
    envPrefix: 'PLAYER_',
    plugins: [
        nodePolyfills(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true,
            },
            workbox: {
                globPatterns: ['**/*'],
                sourcemap: true,
                clientsClaim: true,
                skipWaiting: true,
            },
            includeAssets: ['**/*'],
            manifest: {
                name: 'Uplay',
                short_name: 'Uplay',
                description: 'Music player',
                lang: 'ru',
                display: 'standalone',
                display_override: ['window-controls-overlay'],
                scope: '.',
                start_url: '.',
                theme_color: '#191a22',
                orientation: 'portrait',
                background_color: '#191a22',
                icons: [
                    {
                        src: '192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: '512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any',
                    },
                    {
                        src: '512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                ],
                screenshots: [
                    {
                        src: 'w.png',
                        sizes: '1000x624',
                        type: 'image/png',
                        form_factor: 'wide',
                    },
                    {
                        src: 'n.png',
                        sizes: '500x980',
                        type: 'image/png',
                        form_factor: 'narrow',
                    },
                ],
            },
        }),
        Unfonts({
            custom: {
                display: 'swap',
                preload: true,
                injectTo: 'head-prepend',
                families: {
                    'Dancing Script': {
                        src: './assets/font/manrope-*',
                        transform(font) {
                            const [name, weight] = font.basename.split('-')
                            font.weight = weight

                            return font
                        },
                    },
                },
            },
        }),
        vue(),
        svgLoader(),
        ViteSvgSpriteWrapper({
            icons: 'src/assets/icon/src/*.svg',
            outputDir: 'src/assets/icon/dist',
            sprite: {
                shape: {
                    transform: [
                        {
                            svgo: {
                                plugins: [
                                    {
                                        name: 'removeAttrs',
                                        params: {
                                            attrs: ['*:(data-*|stroke|class|fill|stroke-width):*'],
                                        },
                                    },
                                    {
                                        name: 'addAttributesToSVGElement',
                                        params: {
                                            attributes: [{ fill: 'currentColor' }],
                                        },
                                    },
                                    'removeXMLNS',
                                ],
                            },
                        },
                    ],
                },
            },
        }),
    ],
    resolve: {
        alias: {
            '@segment': fileURLToPath(new URL('./src/components/segment', import.meta.url)),
            '@block': fileURLToPath(new URL('./src/components/block', import.meta.url)),
            '@module': fileURLToPath(new URL('./src/components/module', import.meta.url)),
            '@element': fileURLToPath(new URL('./src/components/element', import.meta.url)),
            '@content': fileURLToPath(new URL('./src/components/content', import.meta.url)),
            '@form': fileURLToPath(new URL('./src/components/form', import.meta.url)),
            '@style': fileURLToPath(new URL('./src/assets/style', import.meta.url)),
            '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
            '@repo': fileURLToPath(new URL('./src/repo', import.meta.url)),
            //stream for utils music metadata reader
            util: fileURLToPath(new URL('./node_modules/readable-stream/lib/internal/streams/stream-browser.js', import.meta.url)),
        },
    },
    css: {
        postcss: {
            plugins: [autoprefixer()],
        },
    },
})
