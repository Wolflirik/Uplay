import { parseBuffer } from 'music-metadata-browser'
import { blobToBase64, getFile } from './utils'

export const parseMetadata = async files => {
    if (!files) {
        return []
    }

    let parsedFiles = []

    for (let fileHandle of files) {
        const { arrayBuffer, file } = await getFile(fileHandle.type, fileHandle.file)
        const fileUint8 = new Uint8Array(arrayBuffer)
        const tags = await parseBuffer(fileUint8, { mimeType: file.type, path: file.name, size: file.size }, { duration: true })
        let base64Image = null

        if (fileHandle.type === 'file') {
            fileHandle.file = {
                ab: arrayBuffer,
                type: file.type,
            }
        }

        if (tags.common.picture?.length) {
            const [image] = tags.common.picture
            const imageData = new Uint8ClampedArray(image.data)
            base64Image = await blobToBase64(new Blob([imageData], { type: image.type }))
        }

        let artistList = []

        if (tags.common.artists?.length) {
            artistList = tags.common.artists.join(', ').split(', ')
        }

        let genreList = []

        if (tags.common.genre?.length) {
            genreList = tags.common.genre.join(', ').split(', ')
        }

        parsedFiles.push({
            name: tags.common.title || file.name,
            albumTitle: tags.common?.album || null,
            artistList: artistList,
            genreList: genreList,
            year: tags.common.year?.toString(),
            image: base64Image,
            duration: tags.format.duration || 0,
            fileHandle: fileHandle,
        })
    }

    return parsedFiles
}
