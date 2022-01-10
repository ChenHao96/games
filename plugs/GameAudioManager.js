window.GameAudioManager = (() => {
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
        const source4 = document.createElement("source")
        source4.src = name + ".wav"
        source4.type = "audio/wav"
        audio.appendChild(source4)
        const embed = document.createElement("embed")
        embed.src = name + ".mp3"
        audio.appendChild(embed)
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
            document.body.removeChild(this)
        }
        document.body.appendChild(appendAudio)
        appendAudio.volume = effectsVolume
        playMusic(appendAudio)
    }
    let cacheBackgroundMusic = undefined
    GameAudioManager.setBackgroundMusic = function (name) {
        if (cacheBackgroundMusic) {
            cacheBackgroundMusic.pause()
            document.body.removeChild(cacheBackgroundMusic)
        }
        cacheBackgroundMusic = cacheSoundEffect[name]
        if (undefined === cacheBackgroundMusic) {
            cacheBackgroundMusic = createAudioControl(name)
        }
        cacheBackgroundMusic.loop = true
        document.body.appendChild(cacheBackgroundMusic)
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
