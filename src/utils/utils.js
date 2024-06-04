export const blobToBase64 = blob => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(blob)
    })
}

export const declOfNum = (n, titles) => {
    return titles[n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2]
}

export const prettyTimeBySeconds = sec => {
    const [minutes, seconds] = (sec / 60).toFixed(2).toString().split('.')
    return [minutes.padStart(2, '0'), seconds.padStart(2, '0')].join(':')
}

export const prettyDateByTimestamp = timestamp => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })
}

export const loadImageBlob = async link => {
    return fetch(link).then(response => response.blob())
}

export const getFile = async (loadType, fileHandler) => {
    let file = fileHandler

    if (loadType === 'fileRef') {
        let mode = await fileHandler.queryPermission({ mode: 'read' })
        if (mode !== 'granted') {
            try {
                if (mode === 'prompt') {
                    mode = await fileHandler.requestPermission({ mode: 'read' })
                }
            } catch {
                return new Promise.reject('Permission not selected')
            }

            if (mode !== 'granted') {
                return new Promise.reject('Permission denied')
            }
        }

        file = await fileHandler.getFile()
    } else if (loadType === 'file') {
        file = new Blob([fileHandler.byteArray], { type: fileHandler.type })
    }

    if (file.size > import.meta.env.PLAYER_ALLOWED_TRACK_SIZE) {
        return new Promise.reject('File too big')
    }

    return new Response(file).arrayBuffer().then(arrayBuffer => {
        return {
            arrayBuffer,
            file,
        }
    })
}

export const wait = async duration =>
    new Promise(resolve => {
        setTimeout(resolve, duration)
    })

const isMobile = () => {
    if (window.navigator.userAgentData) {
        return window.navigator.userAgentData.mobile
    }

    return /Android|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent)
}

export const hashCode = s => {
    for (var i = 0, h = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
    return h
}

export const bufferToBase64 = buffer => {
    const chunks = []
    const uint8 = new Uint8Array(buffer)
    const chunkSize = 0x8000
    for (let i = 0; i < uint8.length; i += chunkSize) {
        const chunk = uint8.subarray(i, Math.min(i + chunkSize, uint8.length))
        chunks.push(String.fromCharCode(...chunk))
    }
    return btoa(chunks.join(''))
}

export const base64ToBuffer = base64 => {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer
}

export const IS_DEVICE_A_MOBILE = isMobile()

export const KEYBOARD_CODES = {
    ENTER: 'Enter',
    ESC: 'Escape',
    SPACE: 'Space',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_UP: 'ArrowUp',
    ARROW_RIGHT: 'ArrowRight',
    ARROW_DOWN: 'ArrowDown',
    P: 'KeyP',
    N: 'KeyN',
    M: 'KeyM',
    T: 'KeyT',
}
