import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            meta: {
                layout: {
                    0: ['SidebarSegment:layout__sidebar', 'ContentSegment:layout__content', 'PlayerSegment:layout__player'],
                    720: ['LogoSegment:layout__logo', 'SidebarSegment:layout__sidebar', 'ContentSegment:layout__content', 'PlayerSegment:layout__player'],
                },
                layoutName: {
                    0: 'main-mobile',
                    720: 'main',
                },
                modules: {
                    sidebar: {
                        0: ['NavigationModule'],
                        1240: ['NavigationModule', 'SmallPlaylistListModule', 'SmallLatestPlayedModule'],
                    },
                    content: {
                        0: ['AlbumListModule', 'ArtistListModule', 'TopPlayedModule'],
                    },
                },
            },
            component: () => import('@content/MainContent.vue'),
        },
        {
            path: '/albums',
            name: 'album-list',
            meta: {
                layout: {
                    0: ['HeaderSegment:layout__header', 'SidebarSegment:layout__sidebar', 'ContentSegment:layout__content', 'PlayerSegment:layout__player'],
                    720: ['LogoSegment:layout__logo', 'HeaderSegment:layout__header', 'SidebarSegment:layout__sidebar', 'ContentSegment:layout__content', 'PlayerSegment:layout__player'],
                },
                layoutName: {
                    0: 'default-mobile',
                    720: 'default',
                },
                modules: {
                    header: {
                        0: ['BackButtonModule', 'MenuButtonModule', 'PageTitleModule'],
                    },
                    sidebar: {
                        0: ['NavigationModule'],
                        1240: ['NavigationModule', 'SmallPlaylistListModule', 'SmallLatestPlayedModule'],
                    },
                },
            },
            component: () => import('@content/AlbumListContent.vue'),
        },
        {
            path: '/albums/:albumId',
            name: 'album-info',
            meta: {
                layout: {
                    0: ['HeaderSegment:layout__header', 'SidebarSegment:layout__sidebar', 'ContentSegment:layout__content', 'PlayerSegment:layout__player'],
                    720: ['LogoSegment:layout__logo', 'HeaderSegment:layout__header', 'SidebarSegment:layout__sidebar', 'ContentSegment:layout__content', 'PlayerSegment:layout__player'],
                },
                layoutName: {
                    0: 'default-mobile',
                    720: 'default',
                },
                modules: {
                    header: {
                        0: ['BackButtonModule', 'MenuButtonModule', 'PageTitleModule'],
                    },
                    sidebar: {
                        0: ['NavigationModule'],
                        1240: ['NavigationModule', 'SmallPlaylistListModule', 'SmallLatestPlayedModule'],
                    },
                },
            },
            component: () => import('@content/AlbumInfoContent.vue'),
        },
        {
            path: '/artists',
            name: 'artist-list',
            meta: {
                layout: {
                    0: ['HeaderSegment:layout__header', 'SidebarSegment:layout__sidebar', 'ContentSegment:layout__content', 'PlayerSegment:layout__player'],
                    720: ['LogoSegment:layout__logo', 'HeaderSegment:layout__header', 'SidebarSegment:layout__sidebar', 'ContentSegment:layout__content', 'PlayerSegment:layout__player'],
                },
                layoutName: {
                    0: 'default-mobile',
                    720: 'default',
                },
                modules: {
                    header: {
                        0: ['BackButtonModule', 'MenuButtonModule', 'PageTitleModule'],
                    },
                    sidebar: {
                        0: ['NavigationModule'],
                        1240: ['NavigationModule', 'SmallPlaylistListModule', 'SmallLatestPlayedModule'],
                    },
                },
            },
            component: () => import('@content/ArtistListContent.vue'),
        },
        {
            path: '/artists/:artistId',
            name: 'artist-info',
            meta: {
                layout: {
                    0: ['HeaderSegment:layout__header', 'SidebarSegment:layout__sidebar', 'ContentSegment:layout__content', 'PlayerSegment:layout__player'],
                    720: ['LogoSegment:layout__logo', 'HeaderSegment:layout__header', 'SidebarSegment:layout__sidebar', 'ContentSegment:layout__content', 'PlayerSegment:layout__player'],
                },
                layoutName: {
                    0: 'default-mobile',
                    720: 'default',
                },
                modules: {
                    header: {
                        0: ['BackButtonModule', 'MenuButtonModule', 'PageTitleModule'],
                    },
                    sidebar: {
                        0: ['NavigationModule'],
                        1240: ['NavigationModule', 'SmallPlaylistListModule', 'SmallLatestPlayedModule'],
                    },
                    content: {
                        0: ['AlbumListModule'],
                    },
                },
            },
            component: () => import('@content/ArtistInfoContent.vue'),
        },
        {
            path: '/playlists',
            name: 'playlist-list',
            component: () => import('@content/PlaylistListContent.vue'),
            meta: {
                layout: {
                    0: ['HeaderSegment:layout__header', 'SidebarSegment:layout__sidebar', 'ContentSegment:layout__content', 'PlayerSegment:layout__player'],
                    720: ['LogoSegment:layout__logo', 'HeaderSegment:layout__header', 'SidebarSegment:layout__sidebar', 'ContentSegment:layout__content', 'PlayerSegment:layout__player'],
                },
                layoutName: {
                    0: 'default-mobile',
                    720: 'default',
                },
                modules: {
                    header: {
                        0: ['BackButtonModule', 'MenuButtonModule', 'PageTitleModule'],
                    },
                    sidebar: {
                        0: ['NavigationModule'],
                        1240: ['NavigationModule', 'SmallPlaylistListModule', 'SmallLatestPlayedModule'],
                    },
                },
            },
        },
        {
            path: '/playlists/:playlistId',
            name: 'playlist-info',
            meta: {
                layout: {
                    0: ['HeaderSegment:layout__header', 'SidebarSegment:layout__sidebar', 'ContentSegment:layout__content', 'PlayerSegment:layout__player'],
                    720: ['LogoSegment:layout__logo', 'HeaderSegment:layout__header', 'SidebarSegment:layout__sidebar', 'ContentSegment:layout__content', 'PlayerSegment:layout__player'],
                },
                layoutName: {
                    0: 'default-mobile',
                    720: 'default',
                },
                modules: {
                    header: {
                        0: ['BackButtonModule', 'MenuButtonModule', 'PageTitleModule'],
                    },
                    sidebar: {
                        0: ['NavigationModule'],
                        1240: ['NavigationModule', 'SmallPlaylistListModule', 'SmallLatestPlayedModule'],
                    },
                    content: {
                        0: ['AlbumListModule'],
                    },
                },
            },
            component: () => import('@content/PlaylistInfoContent.vue'),
        },
        {
            path: '/genres',
            name: 'genre-list',
            component: () => import('@content/GenreListContent.vue'),
            meta: {
                layout: {
                    0: ['HeaderSegment:layout__header', 'SidebarSegment:layout__sidebar', 'ContentSegment:layout__content', 'PlayerSegment:layout__player'],
                    720: ['LogoSegment:layout__logo', 'HeaderSegment:layout__header', 'SidebarSegment:layout__sidebar', 'ContentSegment:layout__content', 'PlayerSegment:layout__player'],
                },
                layoutName: {
                    0: 'default-mobile',
                    720: 'default',
                },
                modules: {
                    header: {
                        0: ['BackButtonModule', 'MenuButtonModule', 'PageTitleModule'],
                    },
                    sidebar: {
                        0: ['NavigationModule'],
                        1240: ['NavigationModule', 'SmallPlaylistListModule', 'SmallLatestPlayedModule'],
                    },
                },
            },
        },
        {
            path: '/genres/:genreId',
            name: 'genre-info',
            meta: {
                layout: {
                    0: ['HeaderSegment:layout__header', 'SidebarSegment:layout__sidebar', 'ContentSegment:layout__content', 'PlayerSegment:layout__player'],
                    720: ['LogoSegment:layout__logo', 'HeaderSegment:layout__header', 'SidebarSegment:layout__sidebar', 'ContentSegment:layout__content', 'PlayerSegment:layout__player'],
                },
                layoutName: {
                    0: 'default-mobile',
                    720: 'default',
                },
                modules: {
                    header: {
                        0: ['BackButtonModule', 'MenuButtonModule', 'PageTitleModule'],
                    },
                    sidebar: {
                        0: ['NavigationModule'],
                        1240: ['NavigationModule', 'SmallPlaylistListModule', 'SmallLatestPlayedModule'],
                    },
                    content: {
                        0: ['AlbumListModule'],
                    },
                },
            },
            component: () => import('@content/GenreInfoContent.vue'),
        },
    ],
})

export default router
