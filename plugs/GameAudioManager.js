window.AudioContext = window.AudioContext || window.webkitAudioContext
window.GameAudioManager = (() => {
    const preload = {}, AudioUtil = {}
    const copyAudioTrack = (inputBuffer, volume) => {
        const rate = inputBuffer.sampleRate
        const channels = inputBuffer.numberOfChannels
        const endOffend = rate * inputBuffer.duration
        const backgroundAudioBuffer = audioContext.createBuffer(channels, endOffend, rate)
        for (let channelNumber = 0; channelNumber < channels; channelNumber++) {
            const input = inputBuffer.getChannelData(channelNumber)
            const output = backgroundAudioBuffer.getChannelData(channelNumber)
            for (let i = 0; i < input.length; i++) {
                output[i] += input[i] * volume
            }
        }
        return backgroundAudioBuffer
    }
    const loadAudio = function (url) {
        return new Promise((resolve, reject) => {
            if (preload[url]) {
                resolve(preload[url])
            } else {
                const xhr = new XMLHttpRequest()
                xhr.withCredentials = true
                xhr.responseType = "arraybuffer"
                xhr.overrideMimeType('application/octet-stream')
                xhr.onerror = function () {
                    reject(this.status)
                }
                xhr.onload = async function () {
                    if (this.status === 200) {
                        // noinspection ES6MissingAwait
                        new AudioContext().decodeAudioData(this.response, function (buffer) {
                            resolve(preload[url] = buffer)
                        }, (e) => {
                            reject(e)
                        })
                    }
                }
                xhr.open("GET", url + ".mp3")
                xhr.send()
            }
        })
    }
    let source = undefined, audioContext = undefined
    let lastBackground = undefined, backgroundAudioBuffer = undefined
    const backgroundAudio = function (inputBuffer) {
        if (lastBackground !== inputBuffer) {
            lastBackground = inputBuffer
            audioContext = new AudioContext()
            backgroundAudioBuffer = copyAudioTrack(inputBuffer, backgroundVolumeTmp)
            if (source) {
                source.stoped = true
                source.stop()
            }
        }
        // TODO: 锁屏后打开没有声音了 safari没有声音
        source = audioContext.createBufferSource()
        source.connect(audioContext.destination)
        source.buffer = backgroundAudioBuffer
        source.start()
        source.onended = function () {
            if (this.stoped) {
                this.onended = null
            } else {
                backgroundAudioBuffer = copyAudioTrack(inputBuffer, backgroundVolumeTmp)
                backgroundAudio(inputBuffer)
            }
        }
    }
    AudioUtil.setBackgroundMusic = (backgroundPath) => {
        loadAudio(backgroundPath).then((inputBuffer) => {
            backgroundAudio(inputBuffer)
        })
    }
    AudioUtil.playSoundEffect = (effectsPath) => {
        loadAudio(effectsPath).then((inputBuffer) => {
            if (backgroundAudioBuffer) {
                const offset = Math.round((audioContext.currentTime % backgroundAudioBuffer.duration) * backgroundAudioBuffer.sampleRate)
                for (let channelNumber = 0; channelNumber < inputBuffer.numberOfChannels; channelNumber++) {
                    const input = inputBuffer.getChannelData(channelNumber)
                    // 循环播放,可能存在merge一部分,后半部分丢失
                    const output = backgroundAudioBuffer.getChannelData(channelNumber)
                    for (let i = 0; i < input.length; i++) {
                        output[i + offset] += input[i] * effectsVolumeTmp
                    }
                }
            } else {
                const source = audioContext.createBufferSource()
                source.buffer = copyAudioTrack(inputBuffer, effectsVolumeTmp)
                source.connect(audioContext.destination)
                source.start()
            }
        })
    }
    let effectsVolume = 1, effectsVolumeTmp = effectsVolume
    AudioUtil.getEffectsVolume = function () {
        return effectsVolume * 100
    }
    AudioUtil.setEffectsVolume = function (volume) {
        effectsVolumeTmp = effectsVolume = Math.floor(Math.abs(volume % 101)) / 100
    }
    const backgroundVolumeChange = () => {
        if (lastBackground) {
            for (let channelNumber = 0; channelNumber < lastBackground.numberOfChannels; channelNumber++) {
                const input = lastBackground.getChannelData(channelNumber)
                const output = backgroundAudioBuffer.getChannelData(channelNumber)
                for (let i = 0; i < input.length; i++) {
                    output[i] = input[i] * backgroundVolumeTmp
                }
            }
        }
    }
    let backgroundVolume = 1, backgroundVolumeTmp = backgroundVolume
    AudioUtil.getBackgroundVolume = function () {
        return backgroundVolume * 100
    }
    AudioUtil.setBackgroundVolume = function (volume) {
        backgroundVolumeTmp = backgroundVolume = Math.floor(Math.abs(volume % 101)) / 100
        backgroundVolumeChange()
    }
    let managerMuted = false
    AudioUtil.getMuted = function () {
        return managerMuted
    }
    AudioUtil.setMuted = function (muted) {
        managerMuted = true === muted || "true" === muted || "TRUE" === muted
        if (managerMuted) {
            effectsVolumeTmp = backgroundVolumeTmp = 0
        } else {
            effectsVolumeTmp = effectsVolume
            backgroundVolumeTmp = backgroundVolume
        }
        backgroundVolumeChange()
    }
    AudioUtil.activityAudio = () => {
    }
    return AudioUtil
})()
