import { useRoute } from 'vue-router'
import { markRaw, reactive, ref, watchEffect } from 'vue'

import module from '@module'
import segment from '@segment'

const loadedComponents = {
    module,
    segment,
}

const findSizeByInnerWidth = (sizesObject, innerWidth) => {
    let size = 0

    if (typeof sizesObject !== 'undefined' && !Object.is(sizesObject, null)) {
        const sizes = Object.keys(sizesObject)
        size = sizes.reduce((prevSize, nextSize) => {
            return prevSize < innerWidth && nextSize > innerWidth ? prevSize : nextSize
        })
    }

    return size
}

const checkExistSizeData = (options = {}) => {
    const sizesObject = options?.position ? options.route?.meta?.[options.type]?.[options.position] : options.route?.meta?.[options.type]
    const size = findSizeByInnerWidth(sizesObject, options.innerWidthRef.value)
    return typeof sizesObject?.[size] !== 'undefined' ? sizesObject[size] : false
}

const loadComponent = (type, name) => {
    if (typeof loadedComponents[type][name] === 'undefined') {
        throw new Error('Component `' + `${name}` + '` is not found!')
    }

    return markRaw(loadedComponents[type][name])
}

export const getSegments = innerWidthRef => {
    const route = useRoute()
    const segments = reactive([])

    watchEffect(() => {
        const existedSegments = checkExistSizeData({ route: route, type: 'layout', innerWidthRef: innerWidthRef })
        let tmpSegments = []

        if (existedSegments) {
            for (let segment of existedSegments) {
                try {
                    const [segmentName, segmentClass] = segment.split(':')
                    tmpSegments.push({
                        class: segmentClass,
                        component: loadComponent('segment', segmentName),
                    })
                } catch (e) {
                    console.log(e)
                    continue
                }
            }
        }

        segments.splice(0, segments.length, ...tmpSegments)
    })

    return segments
}

export const getModules = (position, innerWidthRef) => {
    const route = useRoute()
    const modules = reactive([])

    watchEffect(() => {
        const existedModules = checkExistSizeData({ route: route, type: 'modules', position: position, innerWidthRef: innerWidthRef })
        let tmpModules = []

        if (existedModules) {
            for (let moduleName of existedModules) {
                try {
                    tmpModules.push(loadComponent('module', moduleName))
                } catch (e) {
                    console.log(e)
                    continue
                }
            }
        }

        modules.splice(0, modules.length, ...tmpModules)
    })

    return modules
}

export const getLayoutName = innerWidthRef => {
    const route = useRoute()
    const layoutName = ref('default')

    watchEffect(() => {
        const name = checkExistSizeData({ route: route, type: 'layoutName', innerWidthRef: innerWidthRef })

        if (name) {
            layoutName.value = name
        }
    })

    return layoutName
}
