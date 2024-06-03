import { blobToBase64, getFile } from '@utils/utils'
import { action } from '@repo'
import { computed, ref, watchEffect } from 'vue'
import { visualize } from '@utils/visualizer'
import { KEYBOARD_CODES } from '@utils/utils'

let audio = new Audio()
document.body.appendChild(audio)

const defaultQueue = ref([])
const randomQueue = ref([])

export const queue = computed(() => (shuffleType.value ? randomQueue.value : defaultQueue.value))
export const samples = ref(
    import.meta.env.PLAYER_DEFAULT_AUDIO_SIZE_ARRAY.repeat(+import.meta.env.PLAYER_DEFAULT_SAMPLES_LIMIT)
        .slice(0, -1)
        .split(',')
        .slice(0, +import.meta.env.PLAYER_DEFAULT_SAMPLES_LIMIT),
)
export const currentTrackData = ref({})
export const currentTrackId = computed(() => currentTrackData.value?.id || '')
export const currentIndex = computed(() => {
    if (currentTrackId.value.length) {
        return queue.value.indexOf(currentTrackId.value)
    }

    return 0
})
export const disablePrev = computed(() => {
    return repeatType.value !== 2 ? currentIndex.value === 0 : false
})
export const disableNext = computed(() => {
    return repeatType.value !== 2 ? currentIndex.value === queue.value.length - 1 : false
})
export const currentTime = ref(0)
export const currentVolume = ref(1)
export const mutedStatus = ref(false)
export const duration = ref(0)
export const playStatus = ref(false)
export const repeatType = ref(0) // 0 unset, 1 one, 2 all
export const shuffleType = ref(0)

export const isIOS = computed(() => /iPad|iPhone|iPod/.test(navigator.platform))

audio.ontimeupdate = () => {
    currentTime.value = audio.currentTime
}

audio.ondurationchange = () => {
    duration.value = audio.duration
}

audio.onvolumechange = () => {
    if (!mutedStatus.value) {
        currentVolume.value = audio.volume
    }
}

audio.onended = () => {
    if (repeatType.value === 1) {
        setCurrentTime(0)
        play(currentTrackId.value)
    } else {
        next()
    }
}

audio.onpause = () => {
    playStatus.value = false
    navigator.mediaSession.playbackState = 'paused'
}

audio.onplay = () => {
    playStatus.value = true
    navigator.mediaSession.playbackState = 'playing'
}

audio.onerror = err => {
    console.log(err)
    pause()
}

document.addEventListener('keydown', e => {
    switch (e.code) {
        case KEYBOARD_CODES.SPACE:
            if (currentTrackId.value) {
                if (playStatus.value) {
                    pause()
                } else {
                    play(currentTrackId.value)
                }
            }
            break
        case KEYBOARD_CODES.M:
            toggleMutedStatus()
            break
        case KEYBOARD_CODES.N:
            if (!disableNext.value || currentTrackId.value) {
                next()
            }
            break
        case KEYBOARD_CODES.P:
            if (!disablePrev.value || currentTrackId.value) {
                prev()
            }
            break
        case KEYBOARD_CODES.ARROW_UP:
            setCurrentVolume(Math.min(currentVolume.value + 0.1, 1))
            break
        case KEYBOARD_CODES.ARROW_DOWN:
            setCurrentVolume(Math.max(currentVolume.value - 0.1, 0.1))
            break
        case KEYBOARD_CODES.ARROW_LEFT:
            setCurrentTime(Math.max(currentTime.value - 10, 0))
            break
        case KEYBOARD_CODES.ARROW_RIGHT:
            setCurrentTime(Math.min(currentTime.value + 10, duration.value))
            break
        default:
            return
    }

    e.preventDefault()
})

const loadAudio = async trackId => {
    currentTrackData.value = action.getTrackById(trackId)

    if (Object.keys(currentTrackData.value).length) {
        try {
            const { arrayBuffer, file } = await getFile(currentTrackData.value.fileType, currentTrackData.value.fileHandle)

            const blob = new Blob([arrayBuffer], {
                type: file.type,
            })

            samples.value = await visualize(arrayBuffer, +import.meta.env.PLAYER_DEFAULT_SAMPLES_LIMIT)

            action.updateTrackPlayCount(currentTrackId.value, currentTrackData.value.playCount)

            return await blobToBase64(blob)
        } catch (e) {
            return Promise.reject(-1)
        }
    } else {
        return Promise.reject(-2)
    }
}

const getAudio = async id => {
    if (!audio.src || currentTrackId.value !== id) {
        try {
            audio.src = await loadAudio(id)
            return new Promise(resolve => {
                audio.load()

                audio.oncanplaythrough = () => {
                    resolve(audio)
                }
            })
        } catch (e) {
            return Promise.reject(e)
        }
    } else {
        return Promise.resolve(audio)
    }
}

const startMediaSession = () => {
    if ('mediaSession' in navigator) {
        if (currentTrackId.value) {
            const artistNames = action.getArtistNamesByTrackId(currentTrackId.value).join(', ')
            const album = action.getAlbumById(currentTrackData.value.albumId)
            const image = action.getImageById(currentTrackData.value.imageId)

            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentTrackData.value.name,
                artist: artistNames || '',
                album: album?.title || '',
                artwork: [{ src: image, sizes: '512x512', type: 'image/png' }],
            })
        } else {
            navigator.mediaSession.metadata = null
        }

        const actions = [
            ['play', !currentTrackId.value ? null : () => play(currentTrackId.value)],
            ['pause', !currentTrackId.value ? null : pause],
            ['previoustrack', disablePrev.value || !currentTrackId.value ? null : prev],
            ['nexttrack', disableNext.value || !currentTrackId.value ? null : next],
            ['seekbackward', !currentTrackId.value || (isIOS.value && (!disablePrev.value || !disableNext.value)) ? null : () => setCurrentTime(Math.max(currentTime.value - 10, 0))],
            ['seekforward', !currentTrackId.value || (isIOS.value && (!disablePrev.value || !disableNext.value)) ? null : () => setCurrentTime(Math.min(currentTime.value + 10, duration.value))],
            ['seekto', !currentTrackId.value ? null : e => setCurrentTime(e.seekTime)],
        ]

        for (const [action, handler] of actions) {
            try {
                navigator.mediaSession.setActionHandler(action, handler)
            } catch (e) {
                console.log(e)
            }
        }
    }
}

const handleEdgeCase = isNext => {
    if (queue.value.length > 1) {
        const newIndex = isNext ? (currentIndex.value + 1) % queue.value.length : (currentIndex.value - 1 + queue.value.length) % queue.value.length
        play(queue.value[newIndex])
    } else {
        setCurrentTime(0)
    }
}

const handlePlayOrPause = (index, isNext) => {
    if (isNext ? index < queue.value.length - 1 : index > 0) {
        play(queue.value[isNext ? index + 1 : index - 1])
    } else {
        setCurrentTime(0)
        pause()
    }
}

const shuffleQueue = queue => {
    let ci = queue.length,
        tmp,
        ri

    while (0 !== ci) {
        ri = Math.floor(Math.random() * ci)
        ci -= 1

        tmp = queue[ci]
        queue[ci] = queue[ri]
        queue[ri] = tmp
    }

    return queue
}

export const play = id => {
    getAudio(id)
        .then(a => {
            audio
                .play()
                .then(() => {
                    startMediaSession()
                })
                .catch(() => {
                    console.log(e)
                })
        })
        .catch(e => {
            console.log('played')
            switch (e) {
                case -1:
                    break
                case -2:
                    next()
                    removeFromQueue([id])
            }
        })
}

export const pause = () => {
    audio.pause()
}

export const prev = () => {
    if (currentIndex.value === 0 && repeatType.value === 2) {
        handleEdgeCase(false)
    } else {
        handlePlayOrPause(currentIndex.value, false)
    }
}

export const next = () => {
    if (currentIndex.value === queue.value.length - 1 && repeatType.value === 2) {
        handleEdgeCase(true)
    } else {
        handlePlayOrPause(currentIndex.value, true)
    }
}

export const setCurrentTime = time => {
    audio.currentTime = +time
}

export const setCurrentVolume = volume => {
    audio.volume = +volume
}

export const setDefaultSamples = () => {
    samples.value = import.meta.env.PLAYER_DEFAULT_AUDIO_SIZE_ARRAY.repeat(+import.meta.env.PLAYER_DEFAULT_SAMPLES_LIMIT)
        .slice(0, -1)
        .split(',')
        .slice(0, +import.meta.env.PLAYER_DEFAULT_SAMPLES_LIMIT)
}

export const addToQueue = ids => {
    defaultQueue.value.push(...ids)
    randomQueue.value.push(...ids)
}

export const removeFromQueue = ids => {
    defaultQueue.value = defaultQueue.value.filter(id => !ids.includes(id))
    randomQueue.value = randomQueue.value.filter(id => !ids.includes(id))
}

export const cleanQueue = () => {
    defaultQueue.value = []
    randomQueue.value = []
    currentTrackData.value = {}
    audio.src = ''
}

export const toggleRepeatType = () => {
    const repeatTypes = [2, 0, 1]
    repeatType.value = repeatTypes[repeatType.value]
}

export const toggleShuffleType = () => {
    shuffleType.value = shuffleType.value ? 0 : 1

    if (shuffleType.value === 1) {
        randomQueue.value = shuffleQueue(queue.value)
    }
}

export const toggleMutedStatus = () => {
    const localCurrentVolume = currentVolume.value
    mutedStatus.value = !audio.muted
    audio.muted = mutedStatus.value
    setCurrentVolume(localCurrentVolume)
}

export const currentPlayStatus = id => {
    return currentTrackId.value === id && playStatus.value
}

watchEffect(startMediaSession)
