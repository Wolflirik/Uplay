import { repos, defaults } from '@repo'
import { getSetting } from '@repo/action/get'

export const updatePlaylist = (id, data) => {
    repos.playlist.where('id', id).update(data)
}

export const updateTrackPlayCount = (id, oldCount) => {
    repos.track.where('id', id).update({
        playCount: oldCount + 1,
        playedAt: Date.now(),
    })
}
