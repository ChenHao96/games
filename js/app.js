(async function () {
    function loadResources(url, split) {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.src = url
            img.onerror = function () {
                reject("资源加载失败!")
            }
            img.onload = function () {
                if (split) {
                    const xhr = new XMLHttpRequest()
                    xhr.responseType = "json"
                    xhr.withCredentials = true
                    xhr.overrideMimeType('application/json')
                    xhr.onload = async () => {
                        if (xhr.status === 200) {
                            const resources = {}
                            const picture = new PictureUtil(this)
                            const array = xhr.response.frames
                            for (let i = 0; i < array.length; i++) {
                                const image = await picture.cutPicture(array[i])
                                resources[image.alt] = image
                            }
                            resolve(resources)
                        } else if (xhr.status === 404) {
                            reject("图片分割失败")
                        }
                    }
                    xhr.open("GET", this.src.substr(0, this.src.lastIndexOf('.')) + ".json")
                    xhr.send()
                } else {
                    resolve(this)
                }
            }
        })
    }

    const resources = await loadResources("res/tetris.png", true)
    GameWorldManager.setDirection(GameWorldManager.Direction.portraiture)
    GameWorldManager.setWorldSize(960, 1440)
    GameAudioManager.activityAudio()
    GameScreenClick.activityClick()
    framework.run(resources)
    const loadings = document.body.getElementsByClassName("loading")
    if (loadings && loadings.length > 0) {
        for (let i = 0; i < loadings.length; i++) {
            document.body.removeChild(loadings[i])
        }
    }
    framework.pushScene(new Application())
})()

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

function Application() {
    this.destroy()
}

Application.prototype.destroy = function () {
    this._drawNodes = []
    this._initialized_ = false
}
Application.prototype.before = function () {
    const img = framework._resources["favicon.ico"]
    GameDrawManager.setTitle("俄罗斯方块-欣欣专享")
    GameDrawManager.setFavicon(img.src)
}
Application.prototype.init = function () {
    if (this._initialized_) {
        return
    }
    this._initialized_ = true
    const bgImg = framework.getImageByFileName("bg.jpg")
    const bgImgNode = framework.createNode({
        res: bgImg, x: 0, y: 0
    })
    this._drawNodes.push(bgImgNode)
    const start = framework.getImageByFileName("200x200.jpg")
    const startNode = framework.createNode({
        res: start, x: bgImgNode.x, y: bgImgNode.y - start.height
    })
    this._drawNodes.push(startNode)
    const startButton = framework.getImageByFileName("but_start.png")
    const startButtonNode = framework.createNode({
        res: startButton, x: bgImgNode.x, y: bgImgNode.y,
        type: 'button', onClick: function () {
            framework.pushScene(new GameMain())
        }
    })
    this._drawNodes.push(startButtonNode)
    const startButtonTextNode = framework.createNode({
        res: "Start Game", x: bgImgNode.x, y: bgImgNode.y,
        type: "text", fontSize: 52, fontFamily: "Georgia"
    })
    startButtonNode.addChild(startButtonTextNode)
}

function GameOver() {
    this.destroy()
}

GameOver.prototype.destroy = function () {
    this._drawNodes = []
    this._initialized_ = false
}
GameOver.prototype.init = function () {
    if (this._initialized_) {
        return
    }
    this._initialized_ = true
    const bgImg = framework.getImageByFileName("msg_box.png")
    const bgImgNode = framework.createNode({res: bgImg, x: 0, y: 0})
    this._drawNodes.push(bgImgNode)
    const gameOverTextNode = framework.createNode({
        res: "GAME OVER", x: bgImgNode.x, y: bgImgNode.y - 160,
        type: "text", fontSize: 72, fontWeight: "bold", fontFamily: "Georgia", fillStyle: "#f6d85f"
    })
    this._drawNodes.push(gameOverTextNode)
    const levelTextNode = framework.createNode({
        res: "LEVEL", x: bgImgNode.x - 150, y: gameOverTextNode.y + 80,
        type: "text", fontSize: 42, fontWeight: "bold", fontFamily: "Georgia", fillStyle: "#f6d85f"
    })
    this._drawNodes.push(levelTextNode)
    this.levelValueTextNode = framework.createNode({
        res: "0", x: levelTextNode.x, y: levelTextNode.y + 52,
        type: "text", fontSize: 32, fontWeight: "bold", fontFamily: "Georgia", fillStyle: "#f6d85f"
    })
    this._drawNodes.push(this.levelValueTextNode)
    const linesTextNode = framework.createNode({
        res: "LINES", x: bgImgNode.x + 150, y: levelTextNode.y,
        type: "text", fontSize: 42, fontWeight: "bold", fontFamily: "Georgia", fillStyle: "#f6d85f"
    })
    this._drawNodes.push(linesTextNode)
    this.linesValueTextNode = framework.createNode({
        res: "0", x: linesTextNode.x, y: linesTextNode.y + 52,
        type: "text", fontSize: 32, fontWeight: "bold", fontFamily: "Georgia", fillStyle: "#f6d85f"
    })
    this._drawNodes.push(this.linesValueTextNode)
    const totalScoreTextNode = framework.createNode({
        res: "TOTAL SCORE", x: bgImgNode.x, y: bgImgNode.y + 42,
        type: "text", fontSize: 42, fontWeight: "bold", fontFamily: "Georgia", fillStyle: "#f6d85f"
    })
    this._drawNodes.push(totalScoreTextNode)
    this.totalScoreValueTextNode = framework.createNode({
        res: "0", x: totalScoreTextNode.x, y: totalScoreTextNode.y + 52,
        type: "text", fontSize: 32, fontWeight: "bold", fontFamily: "Georgia", fillStyle: "#f6d85f"
    })
    this._drawNodes.push(this.totalScoreValueTextNode)
    const buttonHome = framework.getImageByFileName("but_home.png")
    const buttonNotNode = framework.createNode({
        res: buttonHome, x: bgImgNode.x - buttonHome.width * 1.5,
        y: bgImgNode.y + buttonHome.height,
        type: "button", onClick: function () {
            framework.popScene()
            framework.popScene()
        }
    })
    this._drawNodes.push(buttonNotNode)
    const buttonRestart = framework.getImageByFileName("but_restart.png")
    this.buttonRestartNode = framework.createNode({
        res: buttonRestart, x: bgImgNode.x + buttonHome.width * 1.5,
        y: buttonNotNode.y,
        type: "button", onClick: function () {
            framework.popScene()
            framework.popScene()
            framework.pushScene(new GameRunning())
        }
    })
    this._drawNodes.push(this.buttonRestartNode)
}
GameOver.prototype.before = function () {
    this._playButtonNodeScale = 1
    this._playButtonNodeDirection = 1
    this.buttonRestartNode.setScale(this._playButtonNodeScale)
    framework.playEffect("res/game_over")
}
GameOver.prototype.update = function (deltaTime) {
    this.levelValueTextNode.setRes(Cube.level + "")
    this.linesValueTextNode.setRes(Cube.lines + "")
    this.totalScoreValueTextNode.setRes(Cube.totalScore + "")
    if (this._playButtonNodeDirection === 1) {
        if (this._playButtonNodeScale > 1.1) {
            this._playButtonNodeDirection = -1
        }
    } else {
        if (this._playButtonNodeScale < 1) {
            this._playButtonNodeDirection = 1
        }
    }
    this._playButtonNodeScale += this._playButtonNodeDirection * (deltaTime * 0.15)
    this.buttonRestartNode.setScale(this._playButtonNodeScale)
}

function GameExit() {
    this.destroy()
}

GameExit.prototype.destroy = function () {
    this._drawNodes = []
    this._initialized_ = false
}
GameExit.prototype.init = function () {
    if (this._initialized_) {
        return
    }
    this._initialized_ = true
    const bgImg = framework.getImageByFileName("msg_box.png")
    const bgImgNode = framework.createNode({res: bgImg, x: 0, y: 0})
    this._drawNodes.push(bgImgNode)
    const areYouSureTextNode = framework.createNode({
        res: "ARE YOU SURE?", x: bgImgNode.x, y: bgImgNode.y - 72,
        type: "text", fontSize: 64, fontWeight: "bold", fontFamily: "Georgia", fillStyle: "#f6d85f"
    })
    this._drawNodes.push(areYouSureTextNode)
    const buttonNot = framework.getImageByFileName("but_not.png")
    const buttonNotNode = framework.createNode({
        res: buttonNot, x: bgImgNode.x - buttonNot.width * 1.5,
        y: bgImgNode.y + buttonNot.height * 0.8,
        type: "button", onClick: function () {
            framework.popScene()
        }
    })
    this._drawNodes.push(buttonNotNode)
    const buttonYes = framework.getImageByFileName("but_yes.png")
    const buttonYesNode = framework.createNode({
        res: buttonYes, x: bgImgNode.x + buttonYes.width * 1.5,
        y: buttonNotNode.y, type: "button", onClick: function () {
            framework.popScene()
            framework.popScene()
        }
    })
    this._drawNodes.push(buttonYesNode)
}

function GamePause() {
    this.destroy()
}

GamePause.prototype.destroy = function () {
    this._drawNodes = []
    this._initialized_ = false
}
GamePause.prototype.init = function () {
    if (this._initialized_) {
        return
    }
    this._initialized_ = true
    const bgImg = framework.getImageByFileName("bg.jpg")
    const bgImgNode = framework.createNode({res: bgImg, x: 0, y: 0})
    this._drawNodes.push(bgImgNode)
    const pauseText = framework.getImageByFileName("pause_text.png")
    const pauseTextNode = framework.createNode({
        res: pauseText, x: bgImgNode.x, y: bgImgNode.y - pauseText.height
    })
    this._drawNodes.push(pauseTextNode)
    const continueButton = framework.getImageByFileName("but_continue.png")
    const continueButtonNode = framework.createNode({
        res: continueButton, x: bgImgNode.x,
        y: bgImgNode.y + continueButton.height,
        type: "button", onClick: function () {
            framework.popScene()
        }
    })
    this._drawNodes.push(continueButtonNode)
}

function GameMain() {
    this.destroy()
}

GameMain.prototype.destroy = function () {
    this._drawNodes = []
    this._initialized_ = false
}
GameMain.prototype.before = function () {
    if (framework.getMuted()) {
        this._audioConfigNode.setSwitch(false)
    } else {
        this._audioConfigNode.setSwitch(true)
    }
    this._playButtonNodeScale = 1
    this._playButtonNodeDirection = 1
    this.playButtonNode.setScale(this._playButtonNodeScale)
}
GameMain.prototype.init = function () {
    if (this._initialized_) {
        return
    }
    this._initialized_ = true
    framework.playEffect("res/soundtrack", true)
    const bgImg = framework.getImageByFileName("bg.jpg")
    const bgImgNode = framework.createNode({
        res: bgImg, x: 0, y: 0
    })
    this._drawNodes.push(bgImgNode)
    const audioOpen = framework.getImageByFileName("icon_audio-open.png")
    const audioClose = framework.getImageByFileName("icon_audio-close.png")
    this._audioConfigNode = framework.createNode({
        res: audioOpen, res2: audioClose,
        x: bgImgNode.x + bgImg.width / 2 - audioOpen.width,
        y: bgImgNode.y - bgImg.height / 2 + audioOpen.height,
        type: "switch", onSwitch: function (value) {
            framework.setMuted(!value)
        }
    })
    this._drawNodes.push(this._audioConfigNode)
    const logoMenu = framework.getImageByFileName("logo_menu.png")
    this.logoMenuNode = framework.createNode({
        res: logoMenu, x: bgImgNode.x,
        y: bgImgNode.y - logoMenu.height / 2
    })
    this._drawNodes.push(this.logoMenuNode)
    const playButton = framework.getImageByFileName("but_play.png")
    this.playButtonNode = framework.createNode({
        res: playButton, x: bgImgNode.x, y: bgImgNode.y + bgImg.height / 2.5 - playButton.height,
        type: 'button', onClick: function () {
            framework.pushScene(new GameRunning())
        }
    })
    this._drawNodes.push(this.playButtonNode)
}
GameMain.prototype.update = function (deltaTime) {
    if (this._playButtonNodeDirection === 1) {
        if (this._playButtonNodeScale > 1.1) {
            this._playButtonNodeDirection = -1
        }
    } else {
        if (this._playButtonNodeScale < 1) {
            this._playButtonNodeDirection = 1
        }
    }
    this._playButtonNodeScale += this._playButtonNodeDirection * (deltaTime * 0.1)
    this.playButtonNode.setScale(this._playButtonNodeScale)
    GameDrawManager.setClearStatus(GameDrawManager.ClearStatus.once)
}

function GameRunning() {
    this.destroy()
}

GameRunning.prototype.destroy = function () {
    this._drawNodes = []
    this._initialized_ = false
    document.removeEventListener("keydown", this._keyDownEvent_, false)
}
GameRunning.prototype.before = function () {
    if (framework.getMuted()) {
        this._audioConfigNode.setSwitch(false)
    } else {
        this._audioConfigNode.setSwitch(true)
    }
}
GameRunning.prototype.init = function () {
    if (this._initialized_) {
        return
    }
    this._initialized_ = true
    this.moveSpeed = this.moveSpeed_ = 0.8
    this.nextCube = new Cube()
    this.currentCube = new Cube()
    this.currentCube.setOffset(4, 1)
    this._keyDownEvent_ = this.EventKeyDown.bind(this)
    document.addEventListener("keydown", this._keyDownEvent_, false)
    const bgImg = framework.getImageByFileName("bg.jpg")
    const bgImgNode = framework.createNode({
        res: bgImg, x: 0, y: 0
    })
    this._drawNodes.push(bgImgNode)
    const logoMenu = framework.getImageByFileName("logo_menu-small.png")
    this.logoMenuNode = framework.createNode({
        res: logoMenu, x: bgImgNode.x - bgImgNode.width / 2 + logoMenu.width / 2 + 30,
        y: bgImgNode.y - bgImgNode.height / 2 + logoMenu.height / 2 + 30
    })
    this._drawNodes.push(this.logoMenuNode)
    const nextBoard = framework.getImageByFileName("next_board.png")
    const nextBoardNode = this.nextBoardNode = framework.createNode({
        res: nextBoard, y: bgImgNode.y - bgImg.height / 4,
        x: bgImgNode.x + bgImg.width / 2 - nextBoard.width / 2 - 50
    })
    this._drawNodes.push(nextBoardNode)
    const nextTextNode = framework.createNode({
        res: "NEXT", x: nextBoardNode.x, y: nextBoardNode.y - nextBoard.height / 2 + 50,
        type: "text", fontSize: 36, fontWeight: "bold", fontFamily: "Georgia", fillStyle: "#f6d85f"
    })
    this._drawNodes.push(nextTextNode)
    const infoBoard = framework.getImageByFileName("info_board.png")
    const infoBoardNode = framework.createNode({
        res: infoBoard,
        x: nextBoardNode.x, y: nextBoardNode.y + nextBoard.height / 2 + infoBoard.height * 0.7
    })
    this._drawNodes.push(infoBoardNode)
    const levelTextNode = framework.createNode({
        res: "LEVEL", x: infoBoardNode.x, y: infoBoardNode.y - infoBoard.height / 2 + 50,
        type: "text", fontSize: 36, fontWeight: "bold", fontFamily: "Georgia", fillStyle: "#f6d85f"
    })
    this._drawNodes.push(levelTextNode)
    this.levelValueTextNode = framework.createNode({
        res: "0", x: levelTextNode.x, y: levelTextNode.y + 56,
        type: "text", fontSize: 36, fontWeight: "bold", fontFamily: "Georgia", fillStyle: "#f6d85f"
    })
    this._drawNodes.push(this.levelValueTextNode)
    const linesTextNode = framework.createNode({
        res: "LINES", x: infoBoardNode.x, y: infoBoardNode.y + 25,
        type: "text", fontSize: 36, fontWeight: "bold", fontFamily: "Georgia", fillStyle: "#f6d85f"
    })
    this._drawNodes.push(linesTextNode)
    this.linesValueTextNode = framework.createNode({
        res: "0", x: linesTextNode.x, y: linesTextNode.y + 52,
        type: "text", fontSize: 36, fontWeight: "bold", fontFamily: "Georgia", fillStyle: "#f6d85f"
    })
    this._drawNodes.push(this.linesValueTextNode)
    const scoreBoard = framework.getImageByFileName("score_board.png")
    const scoreBoardNode = framework.createNode({
        res: scoreBoard,
        x: infoBoardNode.x, y: infoBoardNode.y + infoBoard.height / 2 + infoBoard.height * 0.7
    })
    this._drawNodes.push(scoreBoardNode)
    const scoreTextNode = framework.createNode({
        res: "SCORE", x: scoreBoardNode.x, y: scoreBoardNode.y - scoreBoard.height / 2 + 50,
        type: "text", fontSize: 36, fontWeight: "bold", fontFamily: "Georgia", fillStyle: "#f6d85f"
    })
    this._drawNodes.push(scoreTextNode)
    this.totalScoreValueTextNode = framework.createNode({
        res: "0", x: scoreTextNode.x, y: scoreTextNode.y + 56,
        type: "text", fontSize: 36, fontWeight: "bold", fontFamily: "Georgia", fillStyle: "#f6d85f"
    })
    this._drawNodes.push(this.totalScoreValueTextNode)

    const frameBottom = framework.getImageByFileName("frame_bottom.png")
    const frameBottomNode = framework.createNode({
        res: frameBottom, x: bgImgNode.x - frameBottom.width / 2 + 60, y: scoreBoardNode.y + scoreBoard.height / 2
    })
    this._drawNodes.push(frameBottomNode)
    const top = framework.getImageByFileName("frame_top.png")
    const frameRightNode = framework.createNode({
        res: top, x: frameBottomNode.x + frameBottom.width / 2 - 35, y: frameBottomNode.y - top.height / 2 + 5
    })
    this._drawNodes.push(frameRightNode)
    const frameLeftNode = framework.createNode({
        res: top, x: frameBottomNode.x - frameBottom.width / 2 + 30, y: frameRightNode.y
    })
    const self = this
    const keyLeftButton = framework.getImageByFileName("key-left.png")
    const margin = (bgImg.width - keyLeftButton.width * 2 - keyLeftButton.height * 2) / 5
    const keyLeftButtonNode = framework.createNode({
        res: keyLeftButton, y: frameBottomNode.y + frameBottom.height / 2 + keyLeftButton.height,
        x: -bgImg.width / 2 + margin + keyLeftButton.width / 2,
        type: "button", onClick: self.clickLeft.bind(self)
    })
    this._drawNodes.push(keyLeftButtonNode)
    const moveLeftTextNode = framework.createNode({
        res: "Left", x: keyLeftButtonNode.x, y: keyLeftButtonNode.y + keyLeftButton.height * 0.8,
        type: "text", fontSize: 36, fontWeight: "bold", fontFamily: "Georgia", fillStyle: "#f6d85f"
    })
    this._drawNodes.push(moveLeftTextNode)
    const keyUpButton = framework.getImageByFileName("key-up.png")
    const keyUpButtonNode = framework.createNode({
        res: keyUpButton, y: keyLeftButtonNode.y,
        x: keyLeftButtonNode.x + margin + keyUpButton.width,
        type: "button", onClick: self.clickRotate.bind(self)
    })
    this._drawNodes.push(keyUpButtonNode)
    const rotateCubeTextNode = framework.createNode({
        res: "Rotate", x: keyUpButtonNode.x, y: moveLeftTextNode.y,
        type: "text", fontSize: 36, fontWeight: "bold", fontFamily: "Georgia", fillStyle: "#f6d85f"
    })
    this._drawNodes.push(rotateCubeTextNode)
    const keyRightButton = framework.getImageByFileName("key-right.png")
    const keyRightButtonNode = framework.createNode({
        res: keyRightButton, y: keyUpButtonNode.y,
        x: keyUpButtonNode.x + margin + keyRightButton.width,
        type: "button", onClick: self.clickRight.bind(self)
    })
    this._drawNodes.push(keyRightButtonNode)
    const moveRightTextNode = framework.createNode({
        res: "Right", x: keyRightButtonNode.x, y: rotateCubeTextNode.y,
        type: "text", fontSize: 36, fontWeight: "bold", fontFamily: "Georgia", fillStyle: "#f6d85f"
    })
    this._drawNodes.push(moveRightTextNode)
    const keyDownButton = framework.getImageByFileName("key-down.png")
    const keyDownButtonNode = framework.createNode({
        res: keyDownButton, y: keyRightButtonNode.y,
        x: keyRightButtonNode.x + margin + keyDownButton.width,
        type: "button", onClick: self.clickFast.bind(self)
    })
    this._drawNodes.push(keyDownButtonNode)
    const fastDownTextNode = framework.createNode({
        res: "Fast", x: keyDownButtonNode.x, y: moveRightTextNode.y,
        type: "text", fontSize: 36, fontWeight: "bold", fontFamily: "Georgia", fillStyle: "#f6d85f"
    })
    this._drawNodes.push(fastDownTextNode)

    const exitButton = framework.getImageByFileName("but_exit.png")
    const exitButtonNode = framework.createNode({
        res: exitButton,
        x: bgImgNode.x + bgImg.width / 2 - exitButton.width,
        y: bgImgNode.y - bgImg.height / 2 + exitButton.height,
        type: "button", onClick: function () {
            setTimeout(() => {
                framework.pushScene(new GameExit())
            }, 100)
        }
    })
    this._drawNodes.push(exitButtonNode)
    const pauseButton = framework.getImageByFileName("but_pause.png")
    const pauseButtonNode = framework.createNode({
        res: pauseButton, y: exitButtonNode.y,
        x: exitButtonNode.x - exitButton.width - 20,
        type: "button", onClick: function () {
            framework.pushScene(new GamePause())
        }
    })
    this._drawNodes.push(pauseButtonNode)
    const audioOpen = framework.getImageByFileName("icon_audio-open.png")
    const audioClose = framework.getImageByFileName("icon_audio-close.png")
    this._audioConfigNode = framework.createNode({
        res: audioOpen, res2: audioClose, y: pauseButtonNode.y,
        x: pauseButtonNode.x - pauseButton.width - 20,
        type: "switch", onSwitch: function (value) {
            framework.setMuted(!value)
        }
    })
    this._drawNodes.push(this._audioConfigNode)

    Cube.level = 0
    Cube.lines = 0
    Cube.totalScore = 0
    Cube.array2List = []

    const col = gameBlockCol, row = gameBlockRow
    const beginX = frameRightNode.x - frameBottom.width + 100, beginY = frameRightNode.y - top.height / 2 + 35
    let cell = framework.getImageByFileName("cell_0-0.png")
    for (let r = 0; r < row; r++) {
        const array = []
        for (let c = 0; c < col; c++) {
            const item = {
                setColor: function (color) {
                    this.res = framework.getImageByFileName(color)
                    this.color = color
                },
                getColor: function () {
                    return this.color
                },
                getValue: function () {
                    return this.value
                },
                setValue: function (value) {
                    if (value === 1) {
                        this.value = 1
                        this.node.setRes(this.res)
                    } else {
                        this.value = 0
                        this.node.setRes(null)
                    }
                }
            }
            item.node = framework.createNode({
                x: beginX + cell.width * c - 11 * c,
                y: beginY + cell.height * r - 7 * r
            })
            array.push(item)
        }
        Cube.array2List.push(array)
    }
    for (let r = row - 1; r >= 0; r--) {
        for (let c = col - 1; c >= 0; c--) {
            const item = Cube.array2List[r][c]
            this._drawNodes.push(item.node)
        }
    }
    this._drawNodes.push(frameLeftNode)

    this.nextCubeNode1 = framework.createNode({res: {width: cell.width, height: cell.height}})
    this.nextCubeNode2 = framework.createNode({res: {width: cell.width, height: cell.height}})
    this.nextCubeNode3 = framework.createNode({res: {width: cell.width, height: cell.height}})
    this.nextCubeNode4 = framework.createNode({res: {width: cell.width, height: cell.height}})

    this._drawNodes.push(this.nextCubeNode4)
    this._drawNodes.push(this.nextCubeNode3)
    this._drawNodes.push(this.nextCubeNode2)
    this._drawNodes.push(this.nextCubeNode1)

    this.nextCube.setOffset(0, 0)
    this.setNextCubePosition(this.nextCube.getPosition(), nextBoardNode.x + 10, nextBoardNode.y + 30)
}
GameRunning.prototype.setNextCubePosition = function (position, x, y) {

    if (undefined !== x) {
        this.nextCubeNodeX = x
    }
    if (undefined !== y) {
        this.nextCubeNodeY = y
    }

    const nextCubeNodeX = this.nextCubeNodeX
    const nextCubeNodeY = this.nextCubeNodeY

    const color = this.nextCube.getColor()
    const cell = framework.getImageByFileName(color + "-0.png")
    this.nextCubeNode1.setRes(cell)
    this.nextCubeNode1.setX(nextCubeNodeX + position[0].x * cell.width + (position[0].x * -1 * 11))
    this.nextCubeNode1.setY(nextCubeNodeY + position[0].y * cell.height + (position[0].y * -1 * 7))

    this.nextCubeNode2.setRes(cell)
    this.nextCubeNode2.setX(nextCubeNodeX + position[1].x * cell.width + (position[1].x * -1 * 11))
    this.nextCubeNode2.setY(nextCubeNodeY + position[1].y * cell.height + (position[1].y * -1 * 7))

    this.nextCubeNode3.setRes(cell)
    this.nextCubeNode3.setX(nextCubeNodeX + position[2].x * cell.width + (position[2].x * -1 * 11))
    this.nextCubeNode3.setY(nextCubeNodeY + position[2].y * cell.height + (position[2].y * -1 * 7))

    this.nextCubeNode4.setRes(cell)
    this.nextCubeNode4.setX(nextCubeNodeX + position[3].x * cell.width + (position[3].x * -1 * 11))
    this.nextCubeNode4.setY(nextCubeNodeY + position[3].y * cell.height + (position[3].y * -1 * 7))
}
GameRunning.prototype.update = function (deltaTime) {

    if (undefined === this.runTime) {
        this.runTime = 0
    }

    if (this.gameOver) {
        return
    }

    this.levelValueTextNode.setRes(Cube.level + "")
    this.linesValueTextNode.setRes(Cube.lines + "")
    this.totalScoreValueTextNode.setRes(Cube.totalScore + "")

    this.runTime += deltaTime
    if (this.runTime >= this.moveSpeed) {
        if (!this.currentArrayCubeLock) {
            this.runTime = 0
            this.currentCube.setOffsetY(1)
        }
    }

    if (!this.currentCube.enableOffsetY()) {

        let oneRow = []
        for (let i = 0; i < Cube.array2List.length; i++) {
            let v = 0
            const row = Cube.array2List[i]
            for (let j = 0; j < row.length; j++) {
                v += undefined === row[j].value ? 0 : row[j].value
            }
            if (v === row.length) {
                oneRow.push(i)
            }
        }

        if (oneRow.length > 0) {
            oneRow.unique()
            Cube.lines += oneRow.length
            Cube.totalScore += oneRow.length * 10

            const level = Math.floor(Cube.lines / 10)
            if (level !== Cube.level) {
                Cube.level = level
                this.moveSpeed_ -= 0.05
            }

            let lastRow = undefined
            oneRow = oneRow.sort()
            while (oneRow.length > 0) {
                const rowNum = oneRow.pop()
                for (let i = rowNum; i >= 0; i--) {
                    const row = Cube.array2List[i]
                    for (let j = 0; j < row.length; j++) {
                        if (i > 0) {
                            const row2 = Cube.array2List[i - 1]
                            row[j].setColor(row2[j].getColor())
                            row[j].setValue(row2[j].getValue())
                        } else {
                            row[j].setValue(0)
                        }
                    }
                }
                if (undefined === lastRow) {
                    lastRow = rowNum
                } else if (lastRow - rowNum === 0) {
                    Cube.totalScore += 5
                }
                lastRow = rowNum
                for (let l = 0; l < oneRow.length; l++) {
                    oneRow[l] += 1
                }
            }
            framework.playEffect("res/delete_lines")
        }

        let gameOver = 0
        this.nextCube.setOffset(4, 1)
        const position = this.nextCube.getPosition()
        for (let i = 0; i < position.length; i++) {
            const item = position[i]
            const v = Cube.array2List[item.y][item.x].value
            gameOver += undefined === v ? 0 : v
        }

        if (gameOver > 0) {
            this.gameOver = true
            framework.pushScene(new GameOver())
            return
        }

        this.currentCube = this.nextCube
        this.nextCube = new Cube()
        this.nextCube.setOffset(0, 0)
        this.setNextCubePosition(this.nextCube.getPosition())
    }

    let cubeMove = false
    const arrayPosition = this.currentCube.last
    const currentPosition = this.currentCube.getPosition()
    if (undefined !== arrayPosition && arrayPosition.length > 0) {
        for (let i = 0; i < arrayPosition.length; i++) {
            const position = arrayPosition[i]
            const position2 = currentPosition[i]
            if (position.x !== position2.x) {
                cubeMove = true
                break
            }
            if (position.y !== position2.y) {
                cubeMove = true
                break
            }
        }
    } else {
        cubeMove = true
    }

    if (cubeMove) {

        if (undefined !== arrayPosition && arrayPosition.length > 0) {
            for (let i = 0; i < arrayPosition.length; i++) {
                const position = arrayPosition[i]
                const item = Cube.array2List[position.y][position.x]
                item.setValue(0)
            }
        }

        const color = this.currentCube.getColor()
        for (let i = 0; i < currentPosition.length; i++) {
            const position = currentPosition[i]
            const item = Cube.array2List[position.y][position.x]
            item.setColor(color + "-0.png")
            item.setValue(1)
        }

        this.currentArrayCubeLock = false
        this.currentCube.last = currentPosition
    }

    this.moveSpeed = this.moveSpeed_
}
GameRunning.prototype.clickLeft = function () {
    if (this.currentArrayCubeLock) {
        return
    }
    if (this.currentCube.setOffsetX(-1)) {
        this.currentArrayCubeLock = true
    }
}
GameRunning.prototype.clickRight = function () {
    if (this.currentArrayCubeLock) {
        return
    }
    if (this.currentCube.setOffsetX(1)) {
        this.currentArrayCubeLock = true
    }
}
GameRunning.prototype.clickRotate = function () {
    if (this.currentArrayCubeLock) {
        return
    }
    if (this.currentCube.rotateCube()) {
        this.currentArrayCubeLock = true
    }
}
GameRunning.prototype.clickFast = function () {
    this.moveSpeed = this.moveSpeed_ / 8
}
GameRunning.prototype.EventKeyDown = function (e) {
    switch (e.key) {
        case "ArrowLeft":
            this.clickLeft()
            break;
        case "ArrowUp":
            this.clickRotate()
            break;
        case "ArrowRight":
            this.clickRight()
            break;
        case "ArrowDown":
            this.clickFast()
            break;
    }
}
Cube.array2List = []
Cube.cubeTypes = [
    {
        // W:
        // 000    010    111    100
        // 010    110    010    110
        // 111    010    000    100
        box_wh: 3,
        rotate_XOR: 4,
        filename: "cell_0",
        rotate: [0, 1, 2, 3],
        moveX_XOR: [4, 6, 4, 6],
        moveY_XOR: [6, 4, 6, 4],
        positions: [
            [{x: 0, y: 0}, {x: -1, y: 1}, {x: 0, y: 1}, {x: 1, y: 1}],
            [{x: 0, y: -1}, {x: -1, y: 0}, {x: 0, y: 0}, {x: 0, y: 1}],
            [{x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: -1}, {x: 0, y: 0}],
            [{x: -1, y: -1}, {x: -1, y: 0}, {x: 0, y: 0}, {x: -1, y: 1}]
        ]
    },
    {
        // L:
        // 100    000    011    111
        // 100    001    001    100
        // 110    111    001    000
        box_wh: 3,
        rotate_XOR: 4,
        filename: "cell_1",
        rotate: [0, 1, 2, 3],
        moveX_XOR: [6, 4, 6, 4],
        moveY_XOR: [4, 6, 4, 6],
        positions: [
            [{x: -1, y: -1}, {x: -1, y: 0}, {x: -1, y: 1}, {x: 0, y: 1}],
            [{x: 1, y: 0}, {x: -1, y: 1}, {x: 0, y: 1}, {x: 1, y: 1}],
            [{x: 0, y: -1}, {x: 1, y: -1}, {x: 1, y: 0}, {x: 1, y: 1}],
            [{x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: -1}, {x: -1, y: 0}]
        ]
    },
    {
        // J:
        // 001    111    110    000
        // 001    001    100    100
        // 011    000    100    111
        box_wh: 3,
        rotate_XOR: 4,
        filename: "cell_2",
        rotate: [0, 1, 2, 3],
        moveX_XOR: [6, 4, 6, 4],
        moveY_XOR: [4, 6, 4, 6],
        positions: [
            [{x: 1, y: -1}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}],
            [{x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: -1}, {x: 1, y: 0}],
            [{x: -1, y: -1}, {x: 0, y: -1}, {x: -1, y: 0}, {x: -1, y: 1}],
            [{x: -1, y: 0}, {x: -1, y: 1}, {x: 0, y: 1}, {x: 1, y: 1}]
        ]
    },
    {
        // Z:
        // 110    010
        // 011    110
        // 000    100
        box_wh: 3,
        rotate_XOR: 4,
        filename: "cell_3",
        rotate: [0, 1, 0, 1],
        moveX_XOR: [4, 6, 4, 6],
        moveY_XOR: [6, 4, 6, 4],
        positions: [
            [{x: -1, y: -1}, {x: 0, y: -1}, {x: 0, y: 0}, {x: 1, y: 0}],
            [{x: 0, y: -1}, {x: -1, y: 0}, {x: 0, y: 0}, {x: -1, y: 1}]
        ]
    },
    {
        // N:
        // 011    010
        // 110    011
        // 000    001
        box_wh: 3,
        rotate_XOR: 4,
        filename: "cell_4",
        rotate: [0, 1, 0, 1],
        moveX_XOR: [4, 6, 4, 6],
        moveY_XOR: [6, 4, 6, 4],
        positions: [
            [{x: 0, y: -1}, {x: 1, y: -1}, {x: -1, y: 0}, {x: 0, y: 0}],
            [{x: 0, y: -1}, {x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}]
        ]
    },
    {
        // B:
        // 110
        // 110
        // 000
        box_wh: 3,
        rotate_XOR: 4,
        filename: "cell_5",
        rotate: [0, 0, 0, 0],
        moveX_XOR: [4, 4, 4, 4],
        moveY_XOR: [4, 4, 4, 4],
        positions: [
            [{x: -1, y: -1}, {x: 0, y: -1}, {x: -1, y: 0}, {x: 0, y: 0}]
        ]
    },
    {
        // I:
        // 1111
        // 1000
        // 1000
        // 1000
        box_wh: 4,
        rotate_XOR: 6,
        filename: "cell_6",
        rotate: [0, 1, 0, 1],
        moveX_XOR: [2, 8, 2, 8],
        moveY_XOR: [8, 2, 8, 2],
        positions: [
            [{x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: -1}, {x: 2, y: -1}],
            [{x: -1, y: -1}, {x: -1, y: 0}, {x: -1, y: 1}, {x: -1, y: 2}]
        ]
    }
]

function Cube(type, rotate) {
    if (undefined === type) {
        type = Math.round((Math.random() * 100)) % Cube.cubeTypes.length
    } else {
        type = Math.abs(type) % Cube.cubeTypes.length
    }
    let item = Cube.cubeTypes[type]
    if (undefined === rotate) {
        rotate = Math.round((Math.random() * 100)) % item.rotate.length
    } else {
        rotate = Math.abs(rotate) % item.rotate.length
    }

    this.type = type
    this.item = item
    this.rotate = rotate
}

Cube.level = 0
Cube.lines = 0
Cube.totalScore = 0
const gameBlockCol = 10, gameBlockRow = 19
Cube.prototype.setOffset = function (x, y) {
    this.offsetX = Math.round(Math.abs(x))
    this.offsetY = Math.round(Math.abs(y))
}
Cube.prototype.enableOffsetY = function () {
    return !this.disableOffsetY
}
Cube.prototype.getColor = function () {
    return this.item.filename
}
Cube.prototype.getPosition = function () {
    const self = this
    const result = []
    const positions = this.item.positions[this.item.rotate[this.rotate]]
    for (let i = 0; i < positions.length; i++) {
        const item = positions[i]
        result.push({
            x: self.offsetX + item.x,
            y: self.offsetY + item.y
        })
    }
    return result
}
Cube.prototype.setOffsetY = function (y) {

    if (this.cubeCrossY(y)) {
        this.disableOffsetY = true
        return false
    }

    this.offsetY += y
    return true
}
Cube.prototype.setOffsetX = function (x) {

    if (this.cubeCrossX(x)) {
        framework.playEffect("res/shift_piece")
        return false
    }

    this.offsetX += x
    return true
}
Cube.prototype.rotateCube = function () {

    const r = (this.rotate + 1) % this.item.rotate.length
    if (this.cubeCrossR(r)) {
        framework.playEffect("res/shift_piece")
        return false
    }

    this.rotate = r
    return true
}
Cube.prototype.currentArrayCube = function (x, y, r) {

    function rcValue(row, col) {
        if (row >= gameBlockRow || row < 0) {
            return 1
        } else if (col < 0 || col >= gameBlockCol) {
            return 1
        }
        let value = Cube.array2List[row][col].value
        return undefined === value ? 0 : value
    }

    const array2 = [], array22 = []
    const boxWh = this.item.box_wh + 2
    const offsetY = this.offsetY, offsetX = this.offsetX
    for (let r = 0; r < boxWh; r++) {
        const array = [], array1 = []
        for (let c = 0; c < boxWh; c++) {
            array1[c] = array[c] = rcValue(offsetY + r - 2, offsetX + c - 2)
        }
        array2[r] = array
        array22[r] = array1
    }

    const position = this.item.positions[this.item.rotate[this.rotate]]
    for (let i = 0; i < position.length; i++) {
        array22[position[i].y + 2][position[i].x + 2] = 0
    }

    const positions2 = this.item.positions[this.item.rotate[r]]
    for (let i = 0; i < positions2.length; i++) {
        const item = positions2[i]
        const row = item.y + 2 + y
        if (row >= 0 && row < array22.length) {
            const rowItem = array22[row]
            const col = item.x + 2 + x
            if (col >= 0 && col < rowItem.length) {
                rowItem[col] = 1
            }
        }
    }

    let value = 0
    for (let r = 0; r < array2.length; r++) {
        const item = array2[r]
        for (let c = 0; c < item.length; c++) {
            value += item[c] ^ array22[r][c]
        }
    }

    return value
}
Cube.prototype.cubeCrossR = function (r) {
    const value = this.currentArrayCube(0, 0, r)
    return this.item.rotate_XOR !== value
}
Cube.prototype.cubeCrossX = function (x) {
    const value = this.currentArrayCube(x, 0, this.rotate)
    return this.item.moveX_XOR[this.rotate] !== value
}
Cube.prototype.cubeCrossY = function (y) {
    const value = this.currentArrayCube(0, y, this.rotate)
    return this.item.moveY_XOR[this.rotate] !== value
}
