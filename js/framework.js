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
framework.getWorldSize = () => {
    return GameWorldManager.getWorldSize()
}
framework.getImageByFileName = (fileName) => {
    if (undefined === fileName || undefined === framework._resources) {
        return undefined
    }
    return framework._resources[fileName]
}
framework.run = (resources) => {
    framework._resources = resources
    GameDrawManager.run()
}
framework.stop = () => {
    GameDrawManager.stop()
}
framework.popScene = () => {
    GameDrawManager.popScene()
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
    if (undefined === node) {
        node = {}
    }
    let type = node.type
    if (undefined === type) {
        type = "img"
    }
    let scale = node.scale
    if (undefined !== scale) {
        if (undefined !== node.scale.width) {
            scale.width = node.scale.width
        } else {
            scale.width = 1
        }
        if (undefined !== node.scale.height) {
            scale.height = node.scale.height
        } else {
            scale.height = 1
        }
    } else {
        scale = {
            width: 1,
            height: 1
        }
    }
    const res = node.res
    let width = 0, height = 0, x = 0, y = 0
    if (undefined !== res && null !== res) {
        if (undefined !== res.width) {
            width = res.width
        }
        if (undefined !== res.height) {
            height = res.height
        }
    }
    if (undefined !== node.x) {
        x = node.x
    }
    if (undefined !== node.y) {
        y = node.y
    }
    let onClick = node.onClick, onMouseDown = node.onMouseDown, onMouseUp = node.onMouseUp
    if (undefined === onMouseUp) {
        onMouseUp = () => {
        }
    }
    if (undefined === onMouseDown) {
        onMouseDown = () => {
        }
    }
    if (undefined === onClick) {
        onClick = () => {
        }
    }
    let _switch_ = false
    if ("switch" === node.type) {
        _switch_ = true
    }

    switch (type) {
        case "text": {
            const textSprite = new TextSprite()
            textSprite.setText(res)
            textSprite.setPosition(x, y)
            textSprite.setFillStyle(node.fillStyle)
            textSprite.setFontSize(node.fontSize)
            textSprite.setFontFamily(node.fontFamily)
            return textSprite
        }
        case "img": {
            const imageSprite = new ImageSprite()
            imageSprite.setPosition(x, y)
            imageSprite.setSrc(res.src)
            return imageSprite
        }
        case "button": {
            const buttonSprite = new ButtonSprite(res.src)
            buttonSprite.setSrc()
            buttonSprite.setPosition(x, y)
            const fuc = buttonSprite.getButtonMovePosition
            const clickId = GameScreenClick.addClickItem(fuc)
            buttonSprite.setScreenClickId(clickId)
            return buttonSprite
        }
        case "switch": {
            const switchSprite = new SwitchSprite(res.src, node.res2.src)
            switchSprite.setPosition(x, y)
            const fuc = switchSprite.getButtonMovePosition
            const clickId = GameScreenClick.addClickItem(fuc)
            switchSprite.setScreenClickId(clickId)
            return switchSprite
        }
    }
    // const uuid = framework._uuid += 1
    // return {
    //     _uuid: uuid, rotate: node.rotate,
    //     _switch_: _switch_, setSwitch: function (value) {
    //         this._switch_ = value
    //     },
    //     x: x, y: y,
    //     res: res, res2: node.res2,
    //     setRes: function (res) {
    //         if (undefined !== res && null !== res) {
    //             this.res = res
    //             if (undefined !== res.width) {
    //                 this.width = res.width
    //             }
    //             if (undefined !== res.height) {
    //                 this.height = res.height
    //             }
    //         } else {
    //             this.res = undefined
    //         }
    //     },
    //     width: width, height: height,
    //     scale: scale, setScale: function (scale, height) {
    //         if (undefined === scale) {
    //             return
    //         }
    //         if (undefined !== height) {
    //             this.scale.width = scale
    //             this.scale.height = height
    //         } else {
    //             if (typeof scale === "number") {
    //                 this.scale = {
    //                     width: scale,
    //                     height: scale
    //                 }
    //             } else {
    //                 this.scale = scale
    //             }
    //         }
    //     },
    //     fontFamily: node.fontFamily, fontSize: node.fontSize, fillStyle: node.fillStyle,
    //     type: type, onClick: onClick, onSwitch: node.onSwitch,
    //     onMouseUp: onMouseUp, onMouseDown: onMouseDown
    // }
}
