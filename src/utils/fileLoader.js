import { getFile, IS_DEVICE_A_MOBILE, wait } from './utils'

const isNativeFileSystemSupported = 'showDirectoryPicker' in globalThis

export const getFileRefsRecursively = async (directory, extensions) => {
    let files = []

    for await (const fileRef of directory.values()) {
        if (fileRef.kind === 'file') {
            const isValidFile = extensions.some(ext => fileRef.name.endsWith(`.${ext}`))

            if (isValidFile) {
                files.push(fileRef)
            }
        } else if (fileRef.kind === 'directory') {
            files = [...files, ...(await getFileRefsRecursively(fileRef, extensions))]
        }
    }

    return files
}

export const getFilesFromLegacyInputEvent = (e, extensions) => {
    const { files } = e.target
    if (!files) {
        return []
    }

    return Promise.all(
        Array.from(files)
            .filter(file => extensions.some(ext => file.name.endsWith(`.${ext}`)))
            .map(async loadedFile => {
                const { arrayBuffer, file } = await getFile('initFile', loadedFile)
                return {
                    loadType: 'file',
                    type: file.type,
                    name: file.name,
                    size: file.size,
                    byteArray: arrayBuffer,
                    file: {
                        type: file.type,
                        byteArray: arrayBuffer,
                    },
                }
            }),
    )
}

export const getFilesFromDirectory = async extensions => {
    if (isNativeFileSystemSupported) {
        try {
            const directory = await window.showDirectoryPicker()

            const filesRefs = await getFileRefsRecursively(directory, extensions)
            return await Promise.all(
                filesRefs.map(async ref => {
                    const { arrayBuffer, file } = await getFile('fileRef', ref)
                    return {
                        loadType: 'fileRef',
                        type: file.type,
                        name: file.name,
                        size: file.size,
                        byteArray: arrayBuffer,
                        file: ref,
                    }
                }),
            )
        } catch {
            return null
        }
    }

    const directoryElement = document.createElement('input')
    directoryElement.type = 'file'

    if (IS_DEVICE_A_MOBILE) {
        directoryElement.accept = extensions.map(ext => `.${ext}`).join(', ')
        directoryElement.multiple = true
    } else {
        directoryElement.setAttribute('webkitdirectory', '')
        directoryElement.setAttribute('directory', '')
    }

    return new Promise(resolve => {
        directoryElement.addEventListener('change', e => {
            resolve(getFilesFromLegacyInputEvent(e, extensions))
        })

        wait(100).then(() => {
            directoryElement.click()
        })
    })
}
