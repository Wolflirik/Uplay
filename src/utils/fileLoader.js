import { IS_DEVICE_A_MOBILE, wait } from './utils'

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

    return Array.from(files)
        .filter(file => extensions.some(ext => file.name.endsWith(`.${ext}`)))
        .map(file => ({
            type: 'file',
            file,
        }))
}

export const getFilesFromDirectory = async extensions => {
    if (isNativeFileSystemSupported) {
        try {
            const directory = await window.showDirectoryPicker()

            const filesRefs = await getFileRefsRecursively(directory, extensions)
            return filesRefs.map(ref => ({ type: 'fileRef', file: ref }))
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
