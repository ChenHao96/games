const framework = {}
framework.getMuted = () => {
    return GameAudioManager.getMuted()
}
framework.setVolume = (volume) => {
    GameAudioManager.setEffectsVolume(volume)
    GameAudioManager.setBackgroundVolume(volume)
}
framework.setMuted = (muted) => {
    GameAudioManager.setMuted(muted)
}
framework.playEffect = (url, loop) => {
    if (loop) {
        GameAudioManager.setBackgroundMusic(url)
    } else {
        GameAudioManager.playSoundEffect(url)
    }
}
framework.getImageByFileName = (fileName) => {
    if (undefined === fileName || undefined === framework._resources) {
        return undefined
    }
    return framework._resources[fileName]
}
framework.run = (resources) => {
    framework._resources = resources
}
framework.stop = () => {
    GameDrawManager.stop()
}
framework.popScene = () => {
    const scene = GameDrawManager.popScene()
    if (scene) {
        scene.destroy()
    }
}
framework.pushScene = (scene) => {
    const gameScene = new GameScene()
    gameScene._init = function () {
        const gameLayout = new GameLayout()
        this.addChild(gameLayout)
        if (scene.init) {
            scene.init()
        }
        gameLayout._init = function () {
            const array = scene._drawNodes
            if (array && array.length > 0) {
                for (let i = 0; i < array.length; i++) {
                    this.addChild(array[i])
                }
            }
        }
    }
    gameScene._runBefore = function () {
        if (scene.before) {
            scene.before()
        }
    }
    gameScene.update = function (deltaTime) {
        if (scene.update) {
            scene.update(deltaTime)
        }
    }
    GameDrawManager.pushScene(gameScene)
}
framework.createNode = (node) => {
    node = node || {}
    if (undefined === node.res) {
        node.res = {}
    }
    if (undefined === node.res2) {
        node.res2 = {}
    }
    switch (node.type) {
        case "text": {
            const textSprite = new TextSprite(node.res)
            textSprite.setPosition(node.x, node.y)
            textSprite.setFillStyle(node.fillStyle)
            textSprite.setFontSize(node.fontSize)
            textSprite.setFontFamily(node.fontFamily)
            textSprite.setFontWeight(node.fontWeight)
            textSprite.setRes = function (res) {
                textSprite.setText(res)
            }
            return textSprite
        }
        case "button": {
            const buttonSprite = new ButtonSprite(node.res.src, node.res2.src, node.onClick)
            buttonSprite.setPosition(node.x, node.y)
            return buttonSprite
        }
        case "switch": {
            const switchSprite = new SwitchSprite(node.res.src, node.res2.src, node.onSwitch)
            switchSprite.setPosition(node.x, node.y)
            return switchSprite
        }
        default: {
            const imageSprite = new ImageSprite(node.res.src)
            imageSprite.setPosition(node.x, node.y)
            imageSprite.setWidth(node.res.width)
            imageSprite.setHeight(node.res.height)
            imageSprite.setRes = function (res) {
                if (null !== res) {
                    imageSprite.setSrc(res.src)
                } else {
                    imageSprite.setPlaceholder(true)
                }
            }
            return imageSprite
        }
    }
}
