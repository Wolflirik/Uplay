import { blobToBase64, loadImageBlob } from '@utils/utils'
import { repos, defaults } from '@repo'
import { getSetting } from '@repo/action/get'

export const createStartSchema = async () => {
    defaults.favoritePlaylistId = addPlaylist({ name: import.meta.env.PLAYER_INITIAL_PLAYLIST_NAME, emoji: import.meta.env.PLAYER_INITIAL_PLAYLIST_EMOJI })
    defaults.defaultAlbumId = addAlbum(import.meta.env.PLAYER_DEFAULT_ALBUM_NAME)
    defaults.defaultArtistId = addArtist(import.meta.env.PLAYER_DEFAULT_ARTIST_NAME)
    defaults.defaultGenreId = addGenre(import.meta.env.PLAYER_DEFAULT_GENRE_NAME)
    defaults.defaultImageId = await loadImageBlob(import.meta.env.PLAYER_DEFAULT_IMAGE)
        .then(blobToBase64)
        .then(addImage)
}

export const bootRepo = async name => {
    await repos[name].piniaStore().$persistedState.isReady()
}

export const setSetting = (key, value) => {
    if (!Object.is(getSetting(key), null)) {
        repos.setting.where('key', key).update({
            value: value,
        })
    } else {
        repos.setting.insert({
            key: key,
            value: value,
        })
    }
}

export const addPlaylist = data => {
    let { id: playlistId } = repos.playlist.where('name', name => name.toLowerCase() === data.name.toLowerCase()).first() || { id: null }

    if (!playlistId) {
        playlistId = repos.playlist.insert(data).id
    }

    return playlistId
}

export const addAlbum = title => {
    let { id: albumId } = repos.album.where('title', titleSaved => titleSaved.toLowerCase() === title.toLowerCase()).first() || { id: null }

    if (!albumId) {
        albumId = repos.album.insert({
            title: title,
        }).id
    }

    return albumId
}

export const addImage = image => {
    let { id: imageId } = repos.image.where('image', image).first() || { id: null }

    if (!imageId) {
        imageId = repos.image.insert({
            image: image,
        }).id
    }

    return imageId
}

export const addTrack = (albumTitle, image, name, duration, year, fileHandle, artistList, genreList) => {
    let albumId = Object.is(albumTitle, null) ? defaults.defaultAlbumId : addAlbum(albumTitle),
        imageId = Object.is(image, null) ? defaults.defaultImageId : addImage(image),
        { id: trackId } = repos.track
            .where('name', nameSaved => nameSaved.toLowerCase() === name.toLowerCase())
            .where('albumId', albumId)
            .first() || { id: null }

    if (!trackId) {
        trackId = repos.track.insert({
            albumId: albumId,
            imageId: imageId,
            name: name,
            duration: duration,
            year: year,
            fileType: fileHandle.type,
            fileHandle: fileHandle.file,
        }).id
    }

    if (artistList.length) {
        for (let artist of artistList) {
            try {
                addTrackToArtist(trackId, addArtist(artist))
            } catch (e) {
                console.log(e, artist)
            }
        }
    } else {
        addTrackToArtist(trackId, defaults.defaultArtistId)
    }

    if (genreList.length) {
        for (let genre of genreList) {
            addTrackToGenre(trackId, addGenre(genre))
        }
    } else {
        addTrackToGenre(trackId, defaults.defaultGenreId)
    }

    return trackId
}

export const addArtist = name => {
    let { id: artistId } = repos.artist
        .query()
        .where('name', nameSaved => nameSaved.toLowerCase() === name.toLowerCase())
        .first() || { id: null }

    if (!artistId) {
        artistId = repos.artist.insert({
            name: name,
        }).id
    }

    return artistId
}

export const addGenre = name => {
    let { id: genreId } = repos.genre
        .query()
        .where('name', nameSaved => nameSaved.toLowerCase() === name.toLowerCase())
        .first() || { id: null }

    if (!genreId) {
        genreId = repos.genre.insert({
            name: name,
        }).id
    }

    return genreId
}

export const addTrackToArtist = (trackId, artistId) => {
    const artistOwnedTrack = repos.track2artist.query().where('artistId', artistId).where('trackId', trackId).first()

    if (!artistOwnedTrack) {
        repos.track2artist.insert({
            trackId: trackId,
            artistId: artistId,
        })
    }
}

export const addTrackToGenre = (trackId, genreId) => {
    const genreSpecificTrack = repos.track2genre.query().where('genreId', genreId).where('trackId', trackId).first()

    if (!genreSpecificTrack) {
        repos.track2genre.insert({
            trackId: trackId,
            genreId: genreId,
        })
    }
}

export const addTrackToPlaylist = (trackId, playlistId) => {
    const playlistSpecificTrack = repos.track2playlist.query().where('playlistId', playlistId).where('trackId', trackId).first()

    if (!playlistSpecificTrack) {
        repos.track2playlist.insert({
            trackId: trackId,
            playlistId: playlistId,
        })
    }
}

export const addTrackToFavorite = trackId => {
    addTrackToPlaylist(trackId, defaults.favoritePlaylistId)
}

export const fillTrackList = trackList => {
    for (let track of trackList) {
        addTrack(track.albumTitle, track.image, track.name, track.duration, track.year, track.fileHandle, track.artistList, track.genreList)
    }
}
