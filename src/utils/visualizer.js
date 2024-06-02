const filterAudioData = (audioBuffer, count) => {
    const rawData = audioBuffer.getChannelData(0)
    const blockSize = Math.floor(rawData.length / count)
    const samples = []
    for (let i = 0; i < count; i++) {
        const blockStart = blockSize * i
        let sum = 0
        for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(rawData[blockStart + j])
        }
        samples.push(sum / blockSize)
    }

    return samples
}

export const visualize = async (arrayBuffer, count) => {
    const offlineAudioContext = new OfflineAudioContext(1, arrayBuffer.byteLength, 44100)
    const audioBuffer = await offlineAudioContext.decodeAudioData(arrayBuffer)
    const samples = filterAudioData(audioBuffer, count)
    const max = Math.max(...samples)

    // visualize between 0 and 100
    return samples.map(sample => {
        const percent = Math.floor((sample / max) * 100)
        return percent < 10 ? 10 : percent
    })
}
