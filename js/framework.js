const framework = {
    _uuid: 0,
    _volume: 1,
    _resources: {},
    _direction: null
}
framework.getDirection = () => {
    if (null === framework._direction) {
        const linkElement = document.getElementById("CanvasOrientation")
        let orientation = linkElement.href
        orientation = orientation.substring(orientation.lastIndexOf("/") + 1)
        orientation = orientation.substring(0, orientation.lastIndexOf("."))
        framework._direction = orientation
    }
    return framework._direction
}
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
    return {width: framework._canvasElement.width, height: framework._canvasElement.height}
}

framework.pushScene = async (scene) => {
    if (undefined === framework._scenes) {
        framework._scenes = []
    }
    if (undefined !== framework._currentScene && null !== framework._currentScene) {
        framework._scenes.push(framework._currentScene)
    }
    framework._currentScene = scene
    await framework._currentScene.init()
}

framework.popScene = () => {
    if (undefined === framework._scenes || framework._scenes.length <= 0) {
        return
    }
    framework._currentScene.destroy()
    framework._currentScene = framework._scenes.pop()
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
    const uuid = framework._uuid += 1
    return {
        _uuid: uuid, rotate: node.rotate,
        _switch_: _switch_, setSwitch: function (value) {
            this._switch_ = value
        },
        x: x, y: y,
        res: res, res2: node.res2,
        setRes: function (res) {
            if (undefined !== res && null !== res) {
                this.res = res
                if (undefined !== res.width) {
                    this.width = res.width
                }
                if (undefined !== res.height) {
                    this.height = res.height
                }
            } else {
                this.res = undefined
            }
        },
        width: width, height: height,
        scale: scale, setScale: function (scale, height) {
            if (undefined === scale) {
                return
            }
            if (undefined !== height) {
                this.scale.width = scale
                this.scale.height = height
            } else {
                if (typeof scale === "number") {
                    this.scale = {
                        width: scale,
                        height: scale
                    }
                } else {
                    this.scale = scale
                }
            }
        },
        fontFamily: node.fontFamily, fontSize: node.fontSize, fillStyle: node.fillStyle,
        type: type, onClick: onClick, onSwitch: node.onSwitch,
        onMouseUp: onMouseUp, onMouseDown: onMouseDown
    }
}

framework.getImageByFileName = (fileName) => {
    if (undefined === fileName) {
        return fileName
    }
    return framework._resources[fileName]
}

framework.run = (canvasElement, canvasContext, resources) => {
    return new Promise((resolve) => {

        framework._canvasElement = canvasElement
        framework._canvasContext = canvasContext
        framework._resources = resources
        framework._fps_ = 60

        let buttons = {}
        let scene = framework._currentScene

        function drawToCanvas(deltaTime) {

            if (framework._currentScene !== scene) {
                framework._canvasElement.style.cursor = ""
                scene = framework._currentScene
                if (undefined !== scene.before) {
                    scene.before()
                }
                buttons = {}
            }

            if (undefined !== scene.update) {
                scene.update(deltaTime)
            }

            function draw(array) {
                for (let i = 0; i < array.length; i++) {
                    const node = array[i]
                    if ("text" === node.type) {
                        let x = node.x, y = node.y
                        const fillStyle = node.fillStyle ? node.fillStyle : "#000"
                        const fontSize = node.fontSize * node.scale.height
                        framework._canvasContext.fillStyle = fillStyle
                        framework._canvasContext.font = fontSize + "px " + node.fontFamily
                        node.width = framework._canvasContext.measureText(node.res).width
                        node.height = node.fontSize / 1.5
                        y += node.height / 2
                        x -= node.width / 2
                        if (undefined !== node.res && null !== node.res) {
                            framework._canvasContext.fillText(node.res, x, y)
                        }
                    } else {
                        let x = node.x, y = node.y, res = node.res
                        const width = node.width * node.scale.width
                        const height = node.height * node.scale.height
                        x -= width / 2
                        y -= height / 2
                        if ("switch" === node.type) {
                            if (!node._switch_) {
                                res = node.res2
                            }
                        }
                        if (undefined !== node.res && null !== node.res) {
                            framework._canvasContext.drawImage(res, x, y, width, height)
                        }
                        if ("button" === node.type || "switch" === node.type) {
                            buttons[node._uuid] = {
                                beginX: x, beginY: y, _target: node,
                                endX: x + width, endY: y + height
                            }
                            node.onMouseDown = function () {
                                this.setScale(0.9)
                            }
                            node.onMouseUp = function () {
                                this.setScale(1)
                            }
                            if ("switch" === node.type) {
                                node.onClick = function () {
                                    this._switch_ = !this._switch_
                                    this.onSwitch(this._switch_)
                                }
                            }
                        }
                    }
                }
            }

            draw(scene._drawNodes)
        }

        const fps = 1000 / framework._fps_
        const deltaTime = {_lastUpdate: 0, _nextDeltaTimeZero: true}
        framework._runnableId = setTimeout(function timeoutFunc() {

            const now = Date.now()
            if (deltaTime._nextDeltaTimeZero) {
                deltaTime._deltaTime = 0
                deltaTime._nextDeltaTimeZero = false
            } else {
                deltaTime._deltaTime = (now - deltaTime._lastUpdate) / 1000
            }
            deltaTime._lastUpdate = now
            drawToCanvas(deltaTime._deltaTime)

            let timeout = fps - deltaTime._deltaTime
            if (timeout < 0) {
                timeout += fps
            }

            framework._runnableId = setTimeout(timeoutFunc, timeout)
        }, fps)

        const direction = framework.getDirection()

        function getPointOnCanvas(canvas, x, y, item) {
            const bbox = canvas.getBoundingClientRect()
            const position = {
                x: x / bbox.width * canvas.width,
                y: y / bbox.height * canvas.height
            }
            switch (direction) {
                case "portraiture":// 竖屏
                    if (bbox.width >= bbox.height) {
                        position.x = x / bbox.height * canvas.width
                        position.y = y / bbox.width * canvas.height
                    }
                    break;
                default:// 横屏
                    if (bbox.height >= bbox.width) {
                        position.x = x / bbox.height * canvas.width
                        position.y = y / bbox.width * canvas.height
                    }
                    break;
            }
            if (position.x >= item.beginX && position.x <= item.endX) {
                if (position.y >= item.beginY && position.y <= item.endY) {
                    return true
                }
            }
            return false
        }

        let mouseDown = false
        framework._canvasElement.onmousedown = function (e) {
            for (let field in buttons) {
                const item = buttons[field]
                if (getPointOnCanvas(e.target, e.offsetX, e.offsetY, item)) {
                    mouseDown = true
                    item._target.onMouseDown()
                }
            }
        }
        framework._canvasElement.onmouseup = function (e) {
            for (let field in buttons) {
                const item = buttons[field]
                if (getPointOnCanvas(e.target, e.offsetX, e.offsetY, item)) {
                    if (mouseDown) {
                        framework.playEffect("res/click")
                        item._target.onClick()
                    }
                }
                item._target.onMouseUp()
            }
            mouseDown = false
        }
        framework._canvasElement.onmouseleave = () => {
            framework._canvasElement.style.cursor = ""
        }
        framework._canvasElement.onmousemove = function (e) {
            framework._canvasElement.style.cursor = ""
            for (let field in buttons) {
                const item = buttons[field]
                if (getPointOnCanvas(e.target, e.offsetX, e.offsetY, item)) {
                    if (!window._js_binding.isMobileDevice()) {
                        framework._canvasElement.style.cursor = "pointer"
                    }
                }
            }
        }
        resolve(framework)
    })
}

framework.stop = () => {
    clearTimeout(framework._runnableId)
}

Array.unique = function (array) {
    const obj = {}
    for (let i = 0; i < array.length; i++) {
        const value = array[i]
        obj[value] = value
    }
    const result = []
    for (let field in obj) {
        result.push(obj[field])
    }
    return result
}

Array.prototype.unique = function () {
    const array = Array.unique(this)
    for (let i = 0; i < array.length; i++) {
        this[i] = array[i]
    }
    this.length = array.length
    return this
}
