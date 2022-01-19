const AudioUtil = (() => {
    function AudioUtil() {
        this.preload = {}
        this.playAudioBuffer = undefined
        this.audioContext = new AudioContext()
    }

    AudioUtil.prototype.fetchAudio = function (filePaths) {
        const self = this
        for (let i = 0; i < filePaths.length; i++) {
            const filePath = filePaths[i]
            if (filePath instanceof File || filePath instanceof Blob) {
                filePath.arrayBuffer().then((arrayBuffer) => {
                    self.audioContext.decodeAudioData(arrayBuffer).then(buffer => {
                        self.preload[i] = buffer
                    })
                })
            } else {
                const xhr = new XMLHttpRequest()
                xhr.withCredentials = true
                xhr.responseType = "arraybuffer"
                xhr.overrideMimeType('application/octet-stream')
                xhr.onload = () => {
                    if (xhr.status === 200) {
                        self.audioContext.decodeAudioData(xhr.response).then(buffer => {
                            self.preload[i] = buffer
                        })
                    }
                }
                xhr.open("GET", filePath)
                xhr.send()
            }
        }
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
    AudioUtil.prototype.playAudio = function () {
        if (this.playAudioBuffer) {
            const source = this.audioContext.createBufferSource()
            source.connect(this.audioContext.destination)
            source.buffer = this.playAudioBuffer
            source.start()
            source.onended = function () {
                // TODO:
                console.log("ended...")
            }
        }
    }
    return AudioUtil
})()
