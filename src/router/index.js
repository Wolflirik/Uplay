import { createRouter, createWebHistory } from 'vue-router'
import MainContent from '@content/MainContent.vue'
import AlbumListContent from '@content/AlbumListContent.vue'
import AlbumInfoContent from '@content/AlbumInfoContent.vue'
import ArtistListContent from '@content/ArtistListContent.vue'
import ArtistInfoContent from '@content/ArtistInfoContent.vue'
import PlaylistListContent from '@content/PlaylistListContent.vue'
import PlaylistInfoContent from '@content/PlaylistInfoContent.vue'
import GenreListContent from '@content/GenreListContent.vue'
import GenreInfoContent from '@content/GenreInfoContent.vue'

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
            component: MainContent,
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
                        0: ['BackButtonModule', 'PageTitleModule', 'MenuButtonModule'],
                    },
                    sidebar: {
                        0: ['NavigationModule'],
                        1240: ['NavigationModule', 'SmallPlaylistListModule', 'SmallLatestPlayedModule'],
                    },
                },
            },
            component: AlbumListContent,
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
                        0: ['BackButtonModule', 'PageTitleModule', 'MenuButtonModule'],
                    },
                    sidebar: {
                        0: ['NavigationModule'],
                        1240: ['NavigationModule', 'SmallPlaylistListModule', 'SmallLatestPlayedModule'],
                    },
                },
            },
            component: AlbumInfoContent,
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
                        0: ['BackButtonModule', 'PageTitleModule', 'MenuButtonModule'],
                    },
                    sidebar: {
                        0: ['NavigationModule'],
                        1240: ['NavigationModule', 'SmallPlaylistListModule', 'SmallLatestPlayedModule'],
                    },
                },
            },
            component: ArtistListContent,
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
                        0: ['BackButtonModule', 'PageTitleModule', 'MenuButtonModule'],
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
            component: ArtistInfoContent,
        },
        {
            path: '/playlists',
            name: 'playlist-list',
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
                        0: ['BackButtonModule', 'PageTitleModule', 'MenuButtonModule'],
                    },
                    sidebar: {
                        0: ['NavigationModule'],
                        1240: ['NavigationModule', 'SmallPlaylistListModule', 'SmallLatestPlayedModule'],
                    },
                },
            },
            component: PlaylistListContent,
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
                        0: ['BackButtonModule', 'PageTitleModule', 'MenuButtonModule'],
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
            component: PlaylistInfoContent,
        },
        {
            path: '/genres',
            name: 'genre-list',
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
                        0: ['BackButtonModule', 'PageTitleModule', 'MenuButtonModule'],
                    },
                    sidebar: {
                        0: ['NavigationModule'],
                        1240: ['NavigationModule', 'SmallPlaylistListModule', 'SmallLatestPlayedModule'],
                    },
                },
            },
            component: GenreListContent,
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
                        0: ['BackButtonModule', 'PageTitleModule', 'MenuButtonModule'],
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
            component: GenreInfoContent,
        },
    ],
})

export default router
