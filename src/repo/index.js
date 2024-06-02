import { useRepo } from 'pinia-orm'
import * as addActions from '@repo/action/add'
import * as getActions from '@repo/action/get'
import * as removeActions from '@repo/action/remove'
import * as updateActions from '@repo/action/update'

import Playlist from './model/playlist'
import Album from './model/album'
import Track from './model/track'
import Genre from './model/genre'
import Artist from './model/artist'
import Image from './model/image'
import Track2artist from './model/track2artist'
import Track2genre from './model/track2genre'
import Track2playlist from './model/track2playlist'
import Setting from './model/setting'

export const repos = {
    playlist: useRepo(Playlist),
    album: useRepo(Album),
    track: useRepo(Track),
    genre: useRepo(Genre),
    artist: useRepo(Artist),
    image: useRepo(Image),
    track2artist: useRepo(Track2artist),
    track2genre: useRepo(Track2genre),
    track2playlist: useRepo(Track2playlist),
    setting: useRepo(Setting),
}

export let defaults = { defaultAlbumId: '', defaultArtistId: '', defaultGenreId: '', defaultImageId: '', favoritePlaylistId: '' }

export const action = {
    ...addActions,
    ...getActions,
    ...removeActions,
    ...updateActions,
}
