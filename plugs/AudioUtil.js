(() => {

    const loadAudio = function (url) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.withCredentials = true
            xhr.responseType = "arraybuffer"
            xhr.overrideMimeType('application/octet-stream')
            xhr.onload = function () {
                if (this.status === 200) {
                    resolve(this.response)
                }
            }
            xhr.onerror = function () {
                reject(this.status)
            }
            xhr.open("GET", url)
            xhr.send()
        })
    }

    const audioContext = new AudioContext()
    const preload = async function (filePaths) {
        const preload = {}
        for (let i = 0; i < filePaths.length; i++) {
            const filePath = filePaths[i]
            let fileName = i + "", arrayBuffer
            if (filePath instanceof File || filePath instanceof Blob) {
                arrayBuffer = await filePath.arrayBuffer()
            } else {
                fileName = filePath
                arrayBuffer = await loadAudio(filePath)
            }
            preload[fileName] = await audioContext.decodeAudioData(arrayBuffer)
        }
        return preload
    }

    const copyAudioTrack = (inputBuffer) => {
        const rate = inputBuffer.sampleRate
        const channels = inputBuffer.numberOfChannels
        const endOffend = rate * inputBuffer.duration
        const tempArray = new Float32Array(endOffend)
        const backgroundAudioBuffer = audioContext.createBuffer(channels, endOffend, rate)
        for (let index = 0; index < channels; index++) {
            inputBuffer.copyFromChannel(tempArray, index, 0)
            backgroundAudioBuffer.copyToChannel(tempArray, index, 0)
        }
        return backgroundAudioBuffer
    }

    let backgroundAudioBuffer = undefined, lastBackground = undefined, source = undefined
    const backgroundAudio = function (inputBuffer) {
        if (lastBackground !== inputBuffer) {
            lastBackground = inputBuffer
            backgroundAudioBuffer = copyAudioTrack(inputBuffer)
            if (source) {
                source.stoped = true
                source.stop()
            }
        }
        source = audioContext.createBufferSource()
        source.connect(audioContext.destination)
        source.buffer = backgroundAudioBuffer
        source.start()
        source.onended = function () {
            if (this.stoped) {
                this.onended = null
            } else {
                backgroundAudioBuffer = copyAudioTrack(inputBuffer)
                backgroundAudio(inputBuffer)
            }
        }
    }

    const playAudio = function (inputBuffer) {
        if (backgroundAudioBuffer) { // 循环播放的时候可能存在merge一部分后半部分丢失
            const offset = Math.round((audioContext.currentTime % backgroundAudioBuffer.duration) * backgroundAudioBuffer.sampleRate)
            for (let channelNumber = 0; channelNumber < inputBuffer.numberOfChannels; channelNumber++) {
                const input = inputBuffer.getChannelData(channelNumber)
                const output = backgroundAudioBuffer.getChannelData(channelNumber)
                for (let i = 0; i < input.length; i++) {
                    output[i + offset] += input[i]
                }
            }
        } else {
            const source = audioContext.createBufferSource()
            source.connect(audioContext.destination)
            source.buffer = copyAudioTrack(inputBuffer)
            source.start()
        }
    }

    preload(["res/click.mp3", "res/soundtrack.mp3", "res/soundtrack2.mp3"]).then((audios) => {
        backgroundAudio(audios["res/soundtrack.mp3"])
        let playCount = 5
        const taskId = setInterval(() => {
            if (--playCount <= 0) {
                clearInterval(taskId)
            }
            playAudio(audios["res/click.mp3"])
        }, 3000)

        setTimeout(() => {
            backgroundAudio(audios["res/soundtrack2.mp3"])
        }, 8000)
    })
})()


function AudioUtil(filePaths) {
    this.preload = {}
    this.audioContext = new AudioContext()
    return new Promise(async (res) => {
        for (let i = 0; i < filePaths.length; i++) {
            const filePath = filePaths[i]
            let fileName = i + "", arrayBuffer
            if (filePath instanceof File || filePath instanceof Blob) {
                arrayBuffer = await filePath.arrayBuffer()
            } else {
                fileName = filePath
                arrayBuffer = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest()
                    xhr.withCredentials = true
                    xhr.responseType = "arraybuffer"
                    xhr.overrideMimeType('application/octet-stream')
                    xhr.onload = function () {
                        if (this.status === 200) {
                            resolve(this.response)
                        }
                    }
                    xhr.onerror = function () {
                        reject(this.status)
                    }
                    xhr.open("GET", filePath)
                    xhr.send()
                })
            }
            this.preload[fileName] = await this.audioContext.decodeAudioData(arrayBuffer)
        }
        res(this)
    })
}

AudioUtil.prototype.mergeAudio = function (inputBuffer, outputBuffer, offset) {
    // TODO: 延长 playAudioBuffer 的长度
    for (let channelNumber = 0; channelNumber < inputBuffer.numberOfChannels; channelNumber++) {
        const input = inputBuffer.getChannelData(channelNumber)
        const output = outputBuffer.getChannelData(channelNumber)
        for (let i = 0; i < input.length; i++) {
            output[i + offset] += input[i]
        }
    }
}
AudioUtil.prototype.insertAudio = function (inputBuffer, outputBuffer, offset) {
    const tempArray = new Float32Array(inputBuffer.sampleRate * inputBuffer.duration)
    for (let channelNumber = 0; channelNumber < inputBuffer.numberOfChannels; channelNumber++) {
        // TODO: 延长 playAudioBuffer 的长度
        inputBuffer.copyFromChannel(tempArray, channelNumber, 0)
        outputBuffer.copyToChannel(tempArray, channelNumber, offset)
    }
}
AudioUtil.prototype.concatAudio = function (inputBuffer, outputBuffer) {
    const tempArray = new Float32Array(inputBuffer.sampleRate * inputBuffer.duration)
    for (let channelNumber = 0; channelNumber < inputBuffer.numberOfChannels; channelNumber++) {
        // TODO: 延长 playAudioBuffer 的长度
        inputBuffer.copyFromChannel(tempArray, channelNumber, 0)
        outputBuffer.copyToChannel(tempArray, channelNumber, 0)
    }
}
AudioUtil.prototype.playAudio = function (fileName, loop) {
    const inputBuffer = this.preload[fileName]
    if (this.playAudioBuffer) {
        this.mergeAudio(inputBuffer, this.playAudioBuffer)
    } else {
        const rate = inputBuffer.sampleRate;
        const channels = inputBuffer.numberOfChannels;
        const endOffend = rate * inputBuffer.duration;
        this.playAudioBuffer = new AudioContext().createBuffer(channels, endOffend, rate);
        const tempArray = new Float32Array(endOffend)
        for (let index = 0; index < channels; index++) {
            inputBuffer.copyFromChannel(tempArray, index, 0);
            this.playAudioBuffer.copyToChannel(tempArray, index, 0);
        }
    }

    if (this.playing) {
        this.playing = true
        const source = this.audioContext.createBufferSource()
        source.connect(this.audioContext.destination)
        source.buffer = this.playAudioBuffer
        source.start()
        source.onended = () => {
            this.playing = false
            console.log("ended...")
        }
    }
}
