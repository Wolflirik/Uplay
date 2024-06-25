import { useKeys } from 'pinia-orm/helpers'
import { defaults, repos } from '@repo'
import { getArtistIdsByTrackIds, getGenreIdsByTrackIds, getPlaylistIdsByTrackIds } from '@repo/action/get'
import { currentTrackId, pause, removeFromQueue, setCurrentTime, setDefaultSamples } from '@utils/player'

export const removeAlbum = id => {
    const trackIds = useKeys(repos.track.where('albumId', id).get())

    trackIds.forEach(trackId => {
        removeTrack(trackId)
    })

    if (id !== defaults.defaultAlbumId) {
        repos.album.where('id', id).delete()
    }
}

export const removePlaylist = id => {
    const trackIds = repos.track2playlist
        .where('playlistId', id)
        .get()
        .map(el => el['trackId'])
        .filter((value, index, array) => array.indexOf(value) === index)

    trackIds.forEach(trackId => {
        removeTrack(trackId)
    })

    if (id !== defaults.favoritePlaylistId) {
        repos.playlist.where('id', id).delete()
    }
}

export const removeArtist = id => {
    const trackIds = repos.track2artist
        .where('artistId', id)
        .get()
        .map(el => el['trackId'])
        .filter((value, index, array) => array.indexOf(value) === index)

    trackIds.forEach(trackId => {
        removeTrack(trackId)
    })

    if (id !== defaults.defaultArtistId) {
        repos.artist.where('id', id).delete()
    }
}

export const removeGenre = id => {
    const trackIds = repos.track2genre
        .where('genreId', id)
        .get()
        .map(el => el['trackId'])
        .filter((value, index, array) => array.indexOf(value) === index)

    trackIds.forEach(trackId => {
        removeTrack(trackId)
    })

    if (id !== defaults.defaultGenreId) {
        repos.genre.where('id', id).delete()
    }
}

export const removeImage = id => {
    repos.image.where('id', id).delete()
}

export const removeTrack = id => {
    const track = repos.track.find(id) || {}

    const playlistIds = getPlaylistIdsByTrackIds([id])
    const artistIds = getArtistIdsByTrackIds([id])
    const genreIds = getGenreIdsByTrackIds([id])

    repos.track.where('id', id).delete()
    repos.track2playlist.where('trackId', id).delete()
    repos.track2artist.where('trackId', id).delete()
    repos.track2genre.where('trackId', id).delete()

    if (id === currentTrackId.value) {
        pause()
        setCurrentTime(0)
        setDefaultSamples()
    }

    removeFromQueue(id)

    if (Object.keys(track).length) {
        const allTracksWithImage = repos.track.where('imageId', track.imageId).get() || []

        if (!allTracksWithImage.length && track.imageId !== defaults.defaultImageId) {
            removeImage(track.imageId)
        }

        const allTracksWithAlbum = repos.track.where('albumId', track.albumId).get() || []

        if (!allTracksWithAlbum.length && track.albumId !== defaults.defaultAlbumId) {
            repos.album.where('id', track.albumId).delete()
        }

        playlistIds.forEach(playlistId => {
            const allTracksWithPlaylist = repos.track2playlist.where('playlistId', playlistId).get() || []

            if (!allTracksWithPlaylist.length && playlistId !== defaults.favoritePlaylistId) {
                repos.playlist.where('id', playlistId).delete()
            }
        })

        artistIds.forEach(artistId => {
            const allTracksWithArtist = repos.track2artist.where('artistId', artistId).get() || []

            if (!allTracksWithArtist.length && artistId !== defaults.defaultArtistId) {
                repos.artist.where('id', artistId).delete()
            }
        })

        genreIds.forEach(genreId => {
            const allTracksWithGenre = repos.track2genre.where('genreId', genreId).get() || []

            if (!allTracksWithGenre.length && genreId !== defaults.defaultGenreId) {
                repos.genre.where('id', genreId).delete()
            }
        })
    }
}

export const removeTrackFromPlaylist = (trackId, playlistId) => {
    repos.track2playlist.query().where('playlistId', playlistId).where('trackId', trackId).delete()
}

export const removeTrackFromFavorite = trackId => {
    removeTrackFromPlaylist(trackId, defaults.favoritePlaylistId)
}
