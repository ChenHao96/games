window.GameAudioManager = (() => {
    if(/iPhone|iPad|iPod|Mac|Safari/i.test(navigator.userAgent)){
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
                    xhr.onload = async function () {
                        if (this.status === 200) {
                            preload[url] = await audioContext.decodeAudioData(this.response)
                            resolve(preload[url])
                        }
                    }
                    xhr.onerror = function () {
                        reject(this.status)
                    }
                    xhr.open("GET", url)
                    xhr.send()
                }
            })
        }
        let source = undefined, audioContext = new AudioContext()
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
                backgroundVolumeChange()
            } else {
                effectsVolumeTmp = effectsVolume
                backgroundVolumeTmp = backgroundVolume
            }
        }
        AudioUtil.activityAudio=()=>{}
        return AudioUtil
    }else{

        const audioTypes = [{type: "audio/ogg", suffix: ".ogg"}, {type: "audio/mpeg", suffix: ".mp3"}]
        const createAudioControl = (name) => {
            const audio = document.createElement("audio")
            cacheSoundEffect[name] = audio
            audio.controls = true
            audio.preload = "auto"
            audio.autoplay = false
            audio.className = "audio-controls"
            for (let i = 0; i < audioTypes.length; i++) {
                const type = audioTypes[i]
                const source = document.createElement("source")
                source.src = name + type.suffix
                source.type = type.type
                audio.appendChild(source)
            }
            return audio
        }
        let enableMedia = false
        const waitPlayAudio = []
        const playMusic = (music) => {
            if (enableMedia) {
                music.play()
            } else {
                waitPlayAudio.push(music)
            }
        }
        let audioIndex = 0, managerMuted = false
        const cacheSoundEffect = {}, playingAudio = {}, GameAudioManager = {}
        GameAudioManager.activityAudio = function () {
            document.addEventListener("click", function playVoice() {
                document.removeEventListener("click", playVoice, false)
                enableMedia = true
                while (waitPlayAudio.length > 0) {
                    waitPlayAudio.pop().play()
                }
            }, false)
        }
        GameAudioManager.playSoundEffect = function (name) {
            let audio = cacheSoundEffect[name]
            if (undefined === audio) {
                audio = createAudioControl(name)
            }
            if (managerMuted) {
                return
            }
            const appendAudio = audio.cloneNode(true)
            audioIndex = (audioIndex + 1) % 10000
            const index = audioIndex
            playingAudio[index] = appendAudio
            appendAudio.onended = function () {
                delete playingAudio[index]
            }
            appendAudio.volume = effectsVolume
            playMusic(appendAudio)
        }
        let cacheBackgroundMusic = undefined, actionPause = false
        GameAudioManager.setBackgroundMusic = function (name) {
            if (cacheBackgroundMusic) {
                cacheBackgroundMusic.pause()
            }
            cacheBackgroundMusic = cacheSoundEffect[name]
            if (undefined === cacheBackgroundMusic) {
                cacheBackgroundMusic = createAudioControl(name)
                cacheBackgroundMusic.onpause = function () {
                    if (this.loop && !actionPause) {
                        this.play()
                    }
                }
            }
            cacheBackgroundMusic.loop = true
            cacheBackgroundMusic.volume = backgroundVolume
            playMusic(cacheBackgroundMusic)
        }
        GameAudioManager.getMuted = function () {
            return managerMuted
        }
        GameAudioManager.setMuted = function (muted) {
            managerMuted = true === muted || "true" === muted || "TRUE" === muted
            if (cacheBackgroundMusic) {
                cacheBackgroundMusic.muted = managerMuted
            }
            for (let index in playingAudio) {
                const audio = playingAudio[index]
                if (audio) {
                    audio.muted = managerMuted
                }
            }
        }
        let effectsVolume = 1
        GameAudioManager.getEffectsVolume = function () {
            return effectsVolume * 100
        }
        GameAudioManager.setEffectsVolume = function (volume) {
            effectsVolume = Math.floor(Math.abs(volume % 101)) / 100
            for (let index in playingAudio) {
                const audio = playingAudio[index]
                if (audio) {
                    audio.volume = effectsVolume
                }
            }
        }
        let backgroundVolume = 1
        GameAudioManager.getBackgroundVolume = function () {
            return backgroundVolume * 100
        }
        GameAudioManager.setBackgroundVolume = function (volume) {
            backgroundVolume = Math.floor(Math.abs(volume % 101)) / 100
            if (cacheBackgroundMusic) {
                cacheBackgroundMusic.volume = backgroundVolume
            }
        }
        return GameAudioManager
    }
})()
