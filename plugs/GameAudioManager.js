function GameAudioManager() {
    const waitPlayAudio = []
    let audioIndex = 0, managerMuted = false, enableMedia = false
    document.addEventListener("focus", function playVoice() {
        document.removeEventListener("focus", playVoice, false)
        enableMedia = true
        while (waitPlayAudio.length > 0) {
            waitPlayAudio.pop().play()
        }
    }, false)
    const createAudioControl = (name) => {
        const audio = document.createElement("audio")
        cacheSoundEffect[name] = audio
        audio.controls = true
        audio.className = "audio-controls"
        const source2 = document.createElement("source")
        source2.src = name + ".ogg"
        source2.type = "audio/ogg"
        audio.appendChild(source2)
        const source = document.createElement("source")
        source.src = name + ".mp3"
        source.type = "audio/mpeg"
        audio.appendChild(source)
        const source3 = document.createElement("source")
        source3.src = name + ".acc"
        source3.type = "audio/acc"
        audio.appendChild(source3)
        return audio
    }
    const cacheSoundEffect = {}, playingAudio = {}
    const body = document.getElementsByTagName("body")[0]
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
            body.removeChild(this)
        }
        body.appendChild(appendAudio)
        if (enableMedia) {
            appendAudio.play()
        } else {
            waitPlayAudio.push(appendAudio)
        }
    }
    let cacheBackgroundMusic = undefined
    GameAudioManager.setBackgroundMusic = function (name) {
        if (cacheBackgroundMusic) {
            cacheBackgroundMusic.pause()
            body.removeChild(cacheBackgroundMusic)
        }
        let cacheBackgroundMusic = cacheSoundEffect[name]
        if (undefined === cacheBackgroundMusic) {
            cacheBackgroundMusic = createAudioControl(name)
        }
        cacheBackgroundMusic.loop = true
        body.appendChild(cacheBackgroundMusic)
        if (enableMedia) {
            cacheBackgroundMusic.play()
        } else {
            waitPlayAudio.push(cacheBackgroundMusic)
        }
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
    GameAudioManager.setEffectsVolume = function (volume) {
        const effectsVolume = Math.round(Math.abs(volume % 101)) / 100
        for (let index in playingAudio) {
            const audio = playingAudio[index]
            if (audio) {
                audio.volume = effectsVolume
            }
        }
    }
    GameAudioManager.setBackgroundVolume = function (volume) {
        const backgroundVolume = Math.round(Math.abs(volume % 101)) / 100
        if (cacheBackgroundMusic) {
            cacheBackgroundMusic.volume = backgroundVolume
        }
    }
}
