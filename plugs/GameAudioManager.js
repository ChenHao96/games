window.GameAudioManager = (() => {
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
        // TODO: safari 不能多音频播放 合成后播放||边播放边合成
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
})()
