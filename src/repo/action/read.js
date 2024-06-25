import { useKeys, useSum } from 'pinia-orm/helpers'
import { repos, defaults } from '@repo'

export const getSetting = key => {
    const setting = repos.setting.where('key', key).first()

    if (Object.is(setting, null)) {
        return null
    }

    return setting.value
}

export const getImageById = id => {
    const image = repos.image.find(id) || {}
    let base64Image = ''

    if (Object.keys(image).length) {
        base64Image = image.image
    }

    return base64Image
}

export const getAlbumById = id => {
    return repos.album.find(id) || {}
}

export const getArtistById = id => {
    return repos.artist.find(id) || {}
}

export const getGenreById = id => {
    return repos.genre.find(id) || {}
}

export const getTrackById = id => {
    return repos.track.find(id) || {}
}

export const getPlaylistById = id => {
    return repos.playlist.find(id) || {}
}

export const getPlaylistByName = name => {
    return repos.playlist.where('name', name).first() || {}
}

export const checkInFavorite = trackId => {
    return !!Object.keys(repos.track2playlist.where('playlistId', defaults.favoritePlaylistId).where('trackId', trackId).get()).length
}

export const getTotalDurationByTrackIds = ids => {
    let totalDuration = 0

    if (!Object.is(ids, null)) {
        const tracks = repos.track.query().whereIn('id', ids).get()

        if (tracks.length) {
            totalDuration = useSum(tracks, 'duration')
        }
    }

    return totalDuration
}

export const getImageIdsByTrackIds = ids => {
    let imageIds = [defaults.defaultImageId]

    if (!Object.is(ids, null)) {
        const images =
            repos.track
                .query()
                .whereIn('id', ids)
                .get()
                .map(el => el['imageId'])
                .filter((value, index, array) => array.indexOf(value) === index) || []

        if (images.length) {
            imageIds = images.slice(0, 4)
        }
    }

    return imageIds
}

export const getImageIdByTrackIds = ids => {
    let imageId = defaults.defaultImageId

    if (!Object.is(ids, null)) {
        const track = repos.track
            .query()
            .whereIn('id', ids)
            .where('imageId', id => id !== defaults.defaultImageId)
            .first()

        if (!Object.is(track, null)) {
            imageId = track.imageId
        }
    }

    return imageId
}

export const getYearByTrackIds = ids => {
    let year = ''

    if (!Object.is(ids, null)) {
        const track = repos.track
            .query()
            .whereIn('id', ids)
            .where('year', year => year !== '')
            .first()

        if (!Object.is(track, null)) {
            year = track.year
        }
    }

    return year
}

export const getArtistNamesByTrackId = id => {
    const artistIds =
        repos.track2artist
            .where('trackId', id)
            .get()
            .map(el => el['artistId']) || []
    let artistList = []
    if (artistIds.length) {
        artistIds.forEach(artistId => {
            const name = getArtistById(artistId)?.name
            if (name) {
                artistList.push(name)
            }
        })
    }

    return artistList
}

export const getArtistIdsByTrackIds = ids => {
    const artistIds = repos.track2artist
        .query()
        .whereIn('trackId', ids)
        .where('artistId', artistId => artistId !== defaults.defaultArtistId)
        .get()
        .map(el => el['artistId'])
        .filter((value, index, array) => array.indexOf(value) === index)
    return artistIds.length ? artistIds : [defaults.defaultArtistId]
}

export const getGenreIdsByTrackIds = ids => {
    const genreIds = repos.track2genre
        .query()
        .whereIn('trackId', ids)
        .where('genreId', genreId => genreId !== defaults.defaultGenreId)
        .get()
        .map(el => el['genreId'])
        .filter((value, index, array) => array.indexOf(value) === index)
    return genreIds.length ? genreIds : [defaults.defaultGenreId]
}

export const getPlaylistIdsByTrackIds = ids => {
    const playlistIds = repos.track2playlist
        .query()
        .whereIn('trackId', ids)
        .get()
        .map(el => el['playlistId'])
        .filter((value, index, array) => array.indexOf(value) === index)
    return playlistIds
}

export const getAlbumIdsByTrackIds = (ids, orderByField = 'addedAt', orderByDirection = 'asc') => {
    const allAlbumIds = repos.track
        .query()
        .whereIn('id', ids)
        .get()
        .map(el => el['albumId'])
        .filter((value, index, array) => array.indexOf(value) === index)

    return useKeys(repos.album.query().whereIn('id', allAlbumIds).orderBy(orderByField, orderByDirection).get())
}

export const getPlaylistListIds = (orderByField = 'addedAt', orderByDirection = 'asc') => {
    return useKeys(repos.playlist.orderBy(orderByField, orderByDirection).get()) || []
}

export const getPlaylistListByName = (query, orderByField = 'addedAt', orderByDirection = 'asc') => {
    return (
        repos.playlist
            .where('name', name => name.toLowerCase().includes(query.toLowerCase()))
            .orderBy(orderByField, orderByDirection)
            .get() || []
    )
}

export const getAlbumListIds = (orderByField = 'addedAt', orderByDirection = 'asc') => {
    return useKeys(repos.album.orderBy(orderByField, orderByDirection).get()) || []
}

export const getGenreListIds = (orderByField = 'addedAt', orderByDirection = 'asc') => {
    return useKeys(repos.genre.orderBy(orderByField, orderByDirection).get()) || []
}

export const getArtistListIds = (orderByField = 'addedAt', orderByDirection = 'asc') => {
    return useKeys(repos.artist.orderBy(orderByField, orderByDirection).get()) || []
}

export const getTrackListIdsByAlbumId = (albumId, orderByField = 'addedAt', orderByDirection = 'asc') => {
    return useKeys(repos.track.where('albumId', albumId).orderBy(orderByField, orderByDirection).get()) || []
}

export const getTrackListIdsByPlaylistId = (playlistId, orderByField = 'addedAt', orderByDirection = 'asc') => {
    const trackIds =
        repos.track2playlist
            .where('playlistId', playlistId)
            .get()
            .map(el => el['trackId'])
            .filter((value, index, array) => array.indexOf(value) === index) || []

    return useKeys(repos.track.query().whereIn('id', trackIds).orderBy(orderByField, orderByDirection).get()) || []
}

export const getTrackListIdsByGenreId = (genreId, orderByField = 'addedAt', orderByDirection = 'asc') => {
    const trackIds =
        repos.track2genre
            .where('genreId', genreId)
            .get()
            .map(el => el['trackId'])
            .filter((value, index, array) => array.indexOf(value) === index) || []

    return useKeys(repos.track.query().whereIn('id', trackIds).orderBy(orderByField, orderByDirection).get()) || []
}

export const getTrackListIdsByArtistId = (artistId, orderByField = 'addedAt', orderByDirection = 'asc') => {
    const trackIds =
        repos.track2artist
            .where('artistId', artistId)
            .get()
            .map(el => el['trackId'])
            .filter((value, index, array) => array.indexOf(value) === index) || []

    return useKeys(repos.track.query().whereIn('id', trackIds).orderBy(orderByField, orderByDirection).get()) || []
}

export const getAlbumListIdsByArtistId = (artistId, orderByField = 'addedAt', orderByDirection = 'asc') => {
    const trackIds =
        repos.track2artist
            .where('artistId', artistId)
            .get()
            .map(el => el['trackId'])
            .filter((value, index, array) => array.indexOf(value) === index) || []

    return getAlbumIdsByTrackIds(trackIds, orderByField, orderByDirection)
}

export const getAlbumListIdsByGenreId = (genreId, orderByField = 'addedAt', orderByDirection = 'asc') => {
    const trackIds =
        repos.track2genre
            .where('genreId', genreId)
            .get()
            .map(el => el['trackId'])
            .filter((value, index, array) => array.indexOf(value) === index) || []

    return getAlbumIdsByTrackIds(trackIds, orderByField, orderByDirection)
}

export const getPlayedTrackIds = (orderByField = 'addedAt', orderByDirection = 'asc') => {
    return (
        useKeys(
            repos.track
                .where('playCount', playCount => playCount > 0)
                .orderBy(orderByField, orderByDirection)
                .get(),
        ) || []
    )
}

export const getAllTrackCount = () => {
    return repos.track.all().length
}
