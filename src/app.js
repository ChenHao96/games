(function () {
    const res = {
        "icon_jinbi.png": "res/icon/icon_jinbi.png",
        "icon_zuanshi.png": "res/icon/icon_zuanshi.png",

        "shuiguo_bj.jpg": "res/shuiguo_bj.jpg",
        "shuiguo_cao.png": "res/shuiguo_cao.png",
        "shuiguo_yaopangun.png": "res/shuiguo_yaopangun.png",
        "shuiguo_youcao.png": "res/shuiguo_youcao.png",
        "shuiguo_zuocao.png": "res/shuiguo_zuocao.png",

        "shuiguo_add.png": "res/shuiguo_add.png",
        "shuiguo_jian.png": "res/shuiguo_jian.png",
        "shuiguo_shuzidi.png": "res/shuiguo_shuzidi.png",

        "shuiguo_dani.png": "res/shuiguo_dani.png",
        "shuiguo_quxiao.png": "res/shuiguo_quxiao.png",

        "shuiguo_cijifenshu.png": "res/shuiguo_cijifenshu.png",
        "shuiguo_yaopangun002.png": "res/shuiguo_yaopangun002.png",

        "shuiguo_shezhi.png": "res/shuiguo_shezhi.png",
        "shuiguo_guiz.png": "res/shuiguo_guiz.png",
        "shuiguo_jcxinxi.png": "res/shuiguo_jcxinxi.png",

        "fruit_lineE1.png": "res/lines/fruit_lineE1.png",
        "fruit_lineE2.png": "res/lines/fruit_lineE2.png",
        "fruit_lineE3.png": "res/lines/fruit_lineE3.png",
        "fruit_lineE4.png": "res/lines/fruit_lineE4.png",
        "fruit_lineE5.png": "res/lines/fruit_lineE5.png",
        "fruit_lineE6.png": "res/lines/fruit_lineE6.png",
        "fruit_lineE7.png": "res/lines/fruit_lineE7.png",
        "fruit_lineE8.png": "res/lines/fruit_lineE8.png",
        "fruit_lineE9.png": "res/lines/fruit_lineE9.png",

        "shuiguo_dazhuantezhuan.png": "res/victory/shuiguo_dazhuantezhuan.png",
        "shuiguo_jiangchidaj.png": "res/victory/shuiguo_jiangchidaj.png",
        "shuiguo_zhuanfanle.png": "res/victory/shuiguo_zhuanfanle.png",
        "shuiguo_zjle.png": "res/victory/shuiguo_zjle.png",
    }

    const resources = []
    for (let field in res) {
        resources.push(res[field])
    }
    resources.push({
        img: 'res/fruit/fruit.png',
        frames: 'res/fruit/fruit.json'
    })
    resources.push({
        img: 'res/lines/line_number.png',
        frames: 'res/lines/line_number.json'
    })

    const baseLayout = new ImageLayout(res["shuiguo_bj.jpg"])
    baseLayout._init = function () {
        const component = new ImageSprite(res["shuiguo_yaopangun.png"])
        this.addChild(component)

        const textY = -45, inputMargin = 20
        const shuzidi = res["shuiguo_shuzidi.png"]
        const myGoldInput = new ImageSprite(shuzidi)
        let myGoldInputX = -this.getWidth() / 2, myGoldInputY = this.getHeight() / 2
        myGoldInputX += myGoldInput.getWidth() - inputMargin / 2
        myGoldInputY -= myGoldInput.getHeight() - 5
        myGoldInput.setPosition(myGoldInputX, myGoldInputY)
        this.addChild(myGoldInput)

        const jinbi = new ImageSprite(res["icon_jinbi.png"])
        jinbi.setPosition(myGoldInput.getX() - myGoldInput.getWidth() / 2, myGoldInput.getY() - 3)
        this.addChild(jinbi)

        const myGold = new TextSprite("我的金币")
        myGold.setFontSize(22)
        myGold.setFillStyle("#fff")
        myGold.setStroke('#7d3b16', 4)
        myGold.setPosition(myGoldInput.getX(), myGoldInput.getY() + textY)
        this.addChild(myGold)

        const mySeaSoulInput = new ImageSprite(shuzidi)
        mySeaSoulInput.setPosition(myGoldInput.getX() + inputMargin + myGoldInput.getWidth(), myGoldInput.getY())
        this.addChild(mySeaSoulInput)

        const zuanshi = new ImageSprite(res["icon_zuanshi.png"])
        zuanshi.setPosition(mySeaSoulInput.getX() - mySeaSoulInput.getWidth() / 2 + 12, mySeaSoulInput.getY())
        this.addChild(zuanshi)

        const mySeaSoul = new TextSprite("我的海魂")
        mySeaSoul.setFontSize(22)
        mySeaSoul.setFillStyle("#fff")
        mySeaSoul.setStroke('#7d3b16', 4)
        mySeaSoul.setPosition(mySeaSoulInput.getX(), myGold.getY())
        this.addChild(mySeaSoul)

        const lineInput = new ImageSprite(shuzidi)
        lineInput.setPosition(mySeaSoulInput.getX() + inputMargin + mySeaSoulInput.getWidth(), mySeaSoulInput.getY())
        this.addChild(lineInput)

        const lineText = new TextSprite("连线数量")
        lineText.setFontSize(22)
        lineText.setFillStyle("#fff")
        lineText.setStroke('#7d3b16', 4)
        lineText.setPosition(lineInput.getX(), myGold.getY())
        this.addChild(lineText)

        const lineBaseInput = new ImageSprite(shuzidi)
        lineBaseInput.setPosition(lineInput.getX() + inputMargin + lineInput.getWidth(), lineInput.getY())
        this.addChild(lineBaseInput)

        const lineBaseText = new TextSprite("单线基数")
        lineBaseText.setFontSize(22)
        lineBaseText.setFillStyle("#fff")
        lineBaseText.setStroke('#7d3b16', 4)
        lineBaseText.setPosition(lineBaseInput.getX(), myGold.getY())
        this.addChild(lineBaseText)
    }

    const titleLayout = new GameLayout()
    titleLayout._init = function () {
        const title = new ImageSprite(res["shuiguo_yaopangun002.png"])
        title.setPosition(0, -this.getHeight() / 2 + title.getHeight() * 0.47)
        this.addChild(title)

        const lucky = new ImageSprite(res["shuiguo_cijifenshu.png"])
        lucky.setPosition(title.getX(), title.getY() + title.getHeight() / 2 + lucky.getHeight() / 2)
        this.addChild(lucky)
    }

    const grassLayout = new GameLayout()
    grassLayout._init = function () {
        const grass = new ImageSprite(res["shuiguo_cao.png"])
        let grassX = -this.getWidth() / 2, grassY = -this.getHeight() / 2
        grassX += grass.getWidth() / 2
        grassY += grass.getHeight() / 2
        grass.setPosition(grassX, grassY)
        this.addChild(grass)

        const grassLeft = new ImageSprite(res["shuiguo_zuocao.png"])
        let grassLeftX = -this.getWidth() / 2, grassLeftY = this.getHeight() / 2
        grassLeftX += grassLeft.getWidth() / 3
        grassLeftY -= grassLeft.getHeight() / 3
        grassLeft.setPosition(grassLeftX, grassLeftY)
        this.addChild(grassLeft)

        const grassRight = new ImageSprite(res["shuiguo_youcao.png"])
        let grassRightX = this.getWidth() / 2, grassRightY = this.getHeight() / 2
        grassRightX -= grassRight.getWidth() / 3
        grassRightY -= grassRight.getHeight() / 3
        grassRight.setPosition(grassRightX, grassRightY)
        this.addChild(grassRight)
    }

    const numberFormat = (value) => {
        value += ""
        let result = [], y = 0
        for (let i = value.length - 1; i >= 0; i--) {
            result.push(value.charAt(i))
            if (y++ >= 2 && i > 0) {
                result.push(",")
                y = 0
            }
        }
        result.reverse()
        return result.join("")
    }

    const gameValue = {
        getGoldPool() {
            if (undefined === this._goldPool) {
                const value = localStorage.getItem("_goldPool")
                if (null === value) {
                    this._goldPool = 1000000
                } else {
                    this._goldPool = Number(value)
                }
            }
            return this._goldPool
        },
        setGoldPool(goldPool) {
            this._goldPool = goldPool
            localStorage.setItem("_goldPool", goldPool)
        },
        getLuckyGold() {
            if (undefined === this._luckyGold) {
                const value = localStorage.getItem("_luckyGold")
                if (null === value) {
                    this._luckyGold = 0
                } else {
                    this._luckyGold = Number(value)
                }
            }
            return this._luckyGold
        },
        setLuckyGold(luckyGold) {
            this._luckyGold = luckyGold
            localStorage.setItem("_luckyGold", luckyGold)
        },
        getSeaSoul() {
            if (undefined === this._seaSoul) {
                const value = localStorage.getItem("_seaSoul")
                if (null === value) {
                    this._seaSoul = 100
                } else {
                    this._seaSoul = Number(value)
                }
            }
            return this._seaSoul
        },
        setSeaSoul(seaSoul) {
            this._seaSoul = seaSoul
            localStorage.setItem("_seaSoul", seaSoul)
        },
        getGold() {
            if (undefined === this._gold) {
                const value = localStorage.getItem("_gold")
                if (null === value) {
                    this._gold = 1000000
                } else {
                    this._gold = Number(value)
                }
            }
            return this._gold
        },
        setGold(gold) {
            this._gold = gold
            localStorage.setItem("_gold", gold)
        },
        getLine() {
            if (undefined === this._line) {
                const value = localStorage.getItem("_line")
                if (null === value) {
                    this._line = 1
                } else {
                    this._line = Number(value)
                }
            }
            return this._line
        },
        setLine(line) {
            this._line = line
            localStorage.setItem("_line", line)
        },
        getLineBase() {
            if (undefined === this._lineBase) {
                const value = localStorage.getItem("_lineBase")
                if (null === value) {
                    this._lineBase = 1000
                } else {
                    this._lineBase = Number(value)
                }
            }
            return this._lineBase
        },
        setLineBase(lineBase) {
            this._lineBase = lineBase
            localStorage.setItem("_lineBase", lineBase)
        }
    }

    const gameScoreLayout = new GameLayout()
    gameScoreLayout._init = function () {

        const goldPool = this._goldPool = new TextImageSprite("res/number/number.png")
        goldPool.setText(numberFormat(gameValue.getGoldPool()))
        let goldPoolY = -this.getHeight() / 2
        goldPoolY += 102
        goldPool.setPosition(0, goldPoolY)
        this.addChild(goldPool)

        const luckyGold = this._luckyGold = new TextImageSprite("res/number/number.png")
        luckyGold.setPosition(goldPool.getX(), goldPool.getY() + 63)
        luckyGold.setText(numberFormat(gameValue.getLuckyGold()))
        luckyGold.setScale(0.8)
        this.addChild(luckyGold)

        const fontsize = 24, color = "#ffe897"
        const myGoldCount = this._myGoldCount = new TextSprite()
        myGoldCount.setText(gameValue.getGold() + "")
        myGoldCount.setFontSize(fontsize)
        myGoldCount.setFillStyle(color)
        let myGoldInputX = -this.getWidth() / 2, myGoldInputY = this.getHeight() / 2
        myGoldInputX += 170
        myGoldInputY -= 50
        myGoldCount.setPosition(myGoldInputX, myGoldInputY)
        this.addChild(myGoldCount)

        const mySeaSoulCount = this._mySeaSoulCount = new TextSprite()
        mySeaSoulCount.setText(gameValue.getSeaSoul() + "")
        mySeaSoulCount.setFontSize(fontsize)
        mySeaSoulCount.setFillStyle(color)
        mySeaSoulCount.setPosition(myGoldCount.getX() + 232, myGoldCount.getY())
        this.addChild(mySeaSoulCount)

        const lineCount = this._lineCount = new TextSprite()
        lineCount.setText(gameValue.getLine() + "")
        lineCount.setFontSize(fontsize)
        lineCount.setFillStyle(color)
        lineCount.setPosition(mySeaSoulCount.getX() + 217, mySeaSoulCount.getY())
        this.addChild(lineCount)

        const lineBaseCount = this._lineBaseCount = new TextSprite()
        lineBaseCount.setText(gameValue.getLineBase() + "")
        lineBaseCount.setFontSize(fontsize)
        lineBaseCount.setFillStyle(color)
        lineBaseCount.setPosition(lineCount.getX() + 210, lineCount.getY())
        this.addChild(lineBaseCount)
    }

    const LayoutColor = new Color(0, 0, 0)
    LayoutColor.setAlpha(125)
    const shopLayout = new ColorLayout(LayoutColor)
    shopLayout._init = function () {

    }

    const ruleLayout = new ColorLayout(LayoutColor)
    ruleLayout._init = function () {
    }

    const settingLayout = new ColorLayout(LayoutColor)
    settingLayout._init = function () {
    }

    const infoLayout = new ColorLayout(LayoutColor)
    infoLayout._init = function () {
    }

    const gameLingLayout = new GameLayout()
    gameLingLayout._init = function () {

        const lineP = {x: -50, y: 15}
        const numberP = {x: -516, y: 15}
        const numberP2 = {x: -516, y: -112}
        const numberP3 = {x: -516, y: 143}
        const linePosition = [{x: -50, y: -112}, {x: -50, y: 15}, {x: -50, y: 143}]
        const numberPosition = [numberP, numberP2, numberP3, numberP2, numberP3, numberP2, numberP3, numberP, numberP]
        for (let i = 3; i < 9; i++) {
            linePosition.push(lineP)
        }

        this._lines = []
        for (let i = 0; i < 9; i++) {
            const line = new ImageSprite(res["fruit_lineE" + (i + 1) + ".png"])
            line.setPosition(linePosition[i].x, linePosition[i].y)
            line.setPlaceholder(true)
            this.addChild(line)
            this._lines.push(line)
        }

        this._numbers = []
        for (let i = 0; i < 9; i++) {
            const number = new ImageSprite(res["fruit_NumE" + (i + 1) + ".png"])
            number.setPosition(numberPosition[i].x, numberPosition[i].y)
            number.setPlaceholder(true)
            this.addChild(number)
            this._numbers.push(number)
        }
    }
    gameLingLayout.showLine = function (lines) {
        if (typeof lines === "number") {
            if (lines >= 0 && lines < 9) {
                this._lines[lines].setPlaceholder(false)
                this._numbers[lines].setPlaceholder(false)
            }
        } else if (typeof lines === "object") {
            if (lines instanceof Array) {
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i]
                    if (line >= 0 && line < 9) {
                        this._lines[line].setPlaceholder(false)
                        this._numbers[line].setPlaceholder(false)
                    }
                }
            }
        } else {
            for (let i = 0; i < 9; i++) {
                this._lines[i].setPlaceholder(true)
                this._numbers[i].setPlaceholder(true)
            }
        }
    }

    const gameScene = new GameScene()
    const game_row = 11, game_col = 5, showItemCount = 3, beginShowIndex = (game_row - showItemCount) / 2
    const gameLayout = new GameLayout()
    gameLayout._init = function () {

        this._array2 = []
        this._imgArray2 = []
        this._updateCount = 0

        const beginFruitX = -405, beginFruitY = -130, addX = 100, addY = 30
        for (let i = 0; i < game_col; i++) {
            const array = [], imgArray = []
            this._array2.push(array)
            this._imgArray2.push(imgArray)
            for (let j = 0; j < game_row; j++) {
                const filename = array[j] = "fruit_" + (101 + j) + ".png"
                if (j >= beginShowIndex && j < beginShowIndex + showItemCount) {
                    const fruitItem = new ImageSprite(res[filename])
                    let fruitItemX = beginFruitX + i * (fruitItem.getWidth() + addX) + ((i - 2) * 10)
                    if (j !== beginShowIndex + 1) {
                        fruitItemX += ((2 - i) * 12)
                    }
                    fruitItem.setPosition(fruitItemX, beginFruitY + (j - beginShowIndex) * (fruitItem.getHeight() + addY))
                    imgArray.push(fruitItem)
                    this.addChild(fruitItem)
                }
            }
        }

        this._game_running = false
        const onceImage = res["shuiguo_dani.png"]
        const autoButton = new ButtonSprite(onceImage, () => {
            if (this._game_running) {
                return
            }
            gameLingLayout.showLine()

            // 扣减消耗的金币
            let use = gameValue.getLine() * gameValue.getLineBase()
            const gold = gameValue.getGold() - use
            if (gold < 0) {
                // TODO: 弹窗金币不足
                return
            }

            gameValue.setGold(gold)
            gameScoreLayout._myGoldCount.setText(gold + "")

            // 50%加入奖池
            use = gameValue.getGoldPool() + (use / 2)
            gameValue.setGoldPool(use)
            gameScoreLayout._goldPool.setText(numberFormat(use))

            const arrayRd = []
            for (let i = 0; i < game_col; i++) {
                let base = (Math.round(Math.random() * 100)) % game_row
                if (i > 0) {
                    base += (2 + i - 1) * arrayRd[i - 1]
                    base %= game_row
                }
                base += (i + 2) * game_row
                arrayRd[i] = base
            }

            this._arrayRd = arrayRd
            this._game_running = true
        })

        let autoButtonX = this.getWidth() / 2, autoButtonY = this.getHeight() / 2
        autoButtonX -= autoButton.getWidth() - 30
        autoButtonY -= autoButton.getHeight() - 20
        autoButton.setPosition(autoButtonX, autoButtonY)
        this.addChild(autoButton)
    }
    gameLayout.update = function () {
        if (this._game_running) {
            if (this._updateCount++ >= 4) {

                let finishCount = 0
                for (let i = 0; i < this._arrayRd.length; i++) {
                    const value = this._arrayRd[i]
                    if (value > 0) {
                        const item = this._array2[i].pop()
                        this._array2[i].unshift(item)
                        this._arrayRd[i] -= 1
                    }
                    finishCount += value
                }

                for (let i = 0; i < game_col; i++) {
                    for (let j = 0; j < showItemCount; j++) {
                        const src = res[this._array2[i][j + beginShowIndex]]
                        this._imgArray2[i][j].setSrc(src)
                    }
                }

                this._updateCount = 0
                if (finishCount === 0) {
                    this._game_running = false

                    // TODO：结算中奖信息
                    gameLingLayout.showLine([1, 3, 7])
                    gameValue.setLuckyGold(10000)
                    GameDrawManager.pushScene(victory)
                    setTimeout(() => {
                        GameDrawManager.popScene()
                    }, 10000)
                }
            }
        }
    }

    const victoryLayout = new ColorLayout(LayoutColor)
    victoryLayout._init = function () {
        this._jiangchidaj = new ImageSprite(res["shuiguo_jiangchidaj.png"])
        this._jiangchidaj.setPosition(0, -this._jiangchidaj.getHeight() / 2)
        this.addChild(this._jiangchidaj)

        this._dazhuantezhuan = new ImageSprite(res["shuiguo_dazhuantezhuan.png"])
        this._dazhuantezhuan.setPosition(0, -this._dazhuantezhuan.getHeight() / 2)
        this.addChild(this._dazhuantezhuan)

        this._zhuanfanl = new ImageSprite(res["shuiguo_zhuanfanle.png"])
        this._zhuanfanl.setPosition(0, -this._zhuanfanl.getHeight() / 2)
        this.addChild(this._zhuanfanl)

        this._zjle = new ImageSprite(res["shuiguo_zjle.png"])
        this._zjle.setPosition(0, -this._zjle.getHeight() / 2)
        this.addChild(this._zjle)

        this._score = new ImageSprite(res["shuiguo_cijifenshu.png"])
        this.addChild(this._score)

        this._luckyGold = new TextImageSprite("res/number/number.png")
        this._luckyGold.setText("0")
        this._luckyGold.setScale(0.8)
        this.addChild(this._luckyGold)
    }
    victoryLayout._runBefore = function () {
        this._jiangchidaj.setPlaceholder(true)
        this._dazhuantezhuan.setPlaceholder(true)
        this._zhuanfanl.setPlaceholder(true)
        this._zjle.setPlaceholder(true)
        if (gameValue.getLuckyGold() <= 100000) {
            this._sprite = this._zjle
        } else if (gameValue.getLuckyGold() <= 300000) {
            this._sprite = this._zhuanfanl
        } else if (gameValue.getLuckyGold() <= 500000) {
            this._sprite = this._dazhuantezhuan
        } else {
            this._sprite = this._jiangchidaj
        }
    }
    victoryLayout.update = function () {
        if (this._sprite) {
            console.log(this)
            console.log(this._sprite)
            this._sprite.setPlaceholder(false)
            this._luckyGold.setText(numberFormat(gameValue.getLuckyGold()))
            this._score.setPosition(this._sprite.getX(), this._sprite.getY() + 30 + this._sprite.getHeight() / 2)
            this._luckyGold.setPosition(this._score.getX(), this._score.getY())
            this._sprite = undefined
        }
    }
    const victory = new GameScene()
    victory._init = function () {
        this.addChild(victoryLayout)
    }

    const buttonLayout = new GameLayout()
    buttonLayout._init = function () {
        const rule = new ButtonSprite(res["shuiguo_guiz.png"], () => {
            gameScene.addChild(ruleLayout, 100)
        })
        rule.setPosition(-400, -267)
        this.addChild(rule)

        const setting = new ButtonSprite(res["shuiguo_shezhi.png"], () => {
            gameScene.addChild(settingLayout, 100)
        })
        setting.setPosition(Math.abs(rule.getX()), rule.getY())
        this.addChild(setting)

        const info = new ButtonSprite(res["shuiguo_jcxinxi.png"], () => {
            gameScene.addChild(infoLayout, 100)
        })
        info.setPosition(setting.getX() - info.getWidth() - 20, setting.getY())
        this.addChild(info)

        const addButtonImage = res["shuiguo_add.png"]
        const subButtonImage = res["shuiguo_jian.png"]
        const myGoldAdd = new ButtonSprite(addButtonImage, () => {
            gameScene.addChild(shopLayout, 100)
        })
        let myGoldAddX = -this.getWidth() / 2, myGoldAddY = this.getHeight() / 2
        myGoldAddX += 260
        myGoldAddY -= myGoldAdd.getHeight() - 3
        myGoldAdd.setPosition(myGoldAddX, myGoldAddY)
        this.addChild(myGoldAdd)

        let lineArray = [1, 2, 3, 4, 5, 6, 7, 8, 9], lineIndex = gameValue.getLine() - 1
        const lineSub = new ButtonSprite(subButtonImage, () => {
            lineIndex -= 1
            lineIndex %= lineArray.length
            if (lineIndex < 0) {
                lineIndex += lineArray.length
            }
            const value = lineArray[lineIndex]
            gameValue.setLine(value)
            gameScoreLayout._lineCount.setText(value + "")
        })
        lineSub.setPosition(myGoldAdd.getX() + 285, myGoldAdd.getY())
        this.addChild(lineSub)
        const lineAdd = new ButtonSprite(addButtonImage, () => {
            lineIndex += 1
            lineIndex %= lineArray.length
            const value = lineArray[lineIndex]
            gameValue.setLine(value)
            gameScoreLayout._lineCount.setText(value + "")
        })
        lineAdd.setPosition(lineSub.getX() + 150, lineSub.getY())
        this.addChild(lineAdd)

        let lineBaseArray = [1000, 2000, 3000, 5000, 10000, 20000, 30000, 50000, 100000], lineBaseIndex = 0
        for (let i = 0; i < lineBaseArray.length; i++) {
            if (lineBaseArray[i] === gameValue.getLineBase()) {
                lineBaseIndex = i
                break
            }
        }
        const lineBaseSub = new ButtonSprite(subButtonImage, () => {
            lineBaseIndex -= 1
            lineBaseIndex %= lineBaseArray.length
            if (lineBaseIndex < 0) {
                lineBaseIndex += lineBaseArray.length
            }
            const value = lineBaseArray[lineBaseIndex]
            gameValue.setLineBase(value)
            gameScoreLayout._lineBaseCount.setText(value + "")
        })
        lineBaseSub.setPosition(lineAdd.getX() + 60, lineAdd.getY())
        this.addChild(lineBaseSub)
        const lineBaseAdd = new ButtonSprite(addButtonImage, () => {
            lineBaseIndex += 1
            lineBaseIndex %= lineBaseArray.length
            const value = lineBaseArray[lineBaseIndex]
            gameValue.setLineBase(value)
            gameScoreLayout._lineBaseCount.setText(value + "")
        })
        lineBaseAdd.setPosition(lineBaseSub.getX() + 150, lineBaseSub.getY())
        this.addChild(lineBaseAdd)
    }

    GameWorldManager.setDirection(GameWorldManager.Direction.landscape)
    GameWorldManager.setWorldSize(1280, 720)
    GameAudioManager.activityAudio()
    GameScreenClick.activityClick()
    GameDrawManager.preload(resources, (response) => {
        for (let filename in response) {
            res[filename] = response[filename].src
        }
        gameScene._init = function () {
            this.addChild(baseLayout)
            this.addChild(gameLayout)
            this.addChild(gameLingLayout)
            this.addChild(titleLayout)
            this.addChild(gameScoreLayout)
            this.addChild(buttonLayout)
            this.addChild(grassLayout)
        }
        GameDrawManager.pushScene(gameScene)
    })
    GameDrawManager.run()
})()