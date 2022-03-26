(function () {
    const res = {
        "icon_jinbi.png": "res/icon/icon_jinbi.png",
        "icon_zuanshi.png": "res/icon/icon_zuanshi.png",

        "shuiguo_bj.jpg": "res/shuiguo_bj.jpg",
        "shuiguo_cao.png": "res/shuiguo_cao.png",
        "shuiguo_close.png": "res/shuiguo_close.png",
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
    };

    const resources = []
    for (let field in res) {
        resources.push(res[field])
    }
    resources.push({
        img: 'res/number/number.png',
        frames: 'res/number/number.json'
    })

    GameWorldManager.setDirection(GameWorldManager.Direction.landscape)
    GameWorldManager.setWorldSize(1280, 720)
    GameAudioManager.activityAudio()
    GameScreenClick.activityClick()
    GameDrawManager.run()

    GameDrawManager.preload(resources, () => {
        const scene = new GameScene()
        const layout = new GameLayout()
        const background = new ImageSprite(res["shuiguo_bj.jpg"])
        layout.addChild(background, 0)

        const gameValue = {
            getGoldPool() {
                if (undefined === gameValue._goldPool) {
                    gameValue._goldPool = localStorage.getItem("_goldPool")
                    if (null === gameValue._goldPool) {
                        gameValue._goldPool = 1000000
                    }
                }
                return gameValue._goldPool
            },
            setGoldPool(goldPool) {
                gameValue._goldPool = goldPool
                localStorage.setItem("_goldPool", goldPool)
            },
            getLuckyGold() {
                if (undefined === gameValue._luckyGold) {
                    gameValue._luckyGold = localStorage.getItem("_luckyGold")
                    if (null === gameValue._luckyGold) {
                        gameValue._luckyGold = 0
                    }
                }
                return gameValue._luckyGold
            },
            setLuckyGold(luckyGold) {
                gameValue._luckyGold = luckyGold
                localStorage.setItem("_luckyGold", luckyGold)
            },
            getSeaSoul() {
                if (undefined === gameValue._seaSoul) {
                    gameValue._seaSoul = localStorage.getItem("_seaSoul")
                    if (null === gameValue._seaSoul) {
                        gameValue._seaSoul = 100
                    }
                }
                return gameValue._seaSoul
            },
            setSeaSoul(seaSoul) {
                gameValue._seaSoul = seaSoul
                localStorage.setItem("_seaSoul", seaSoul)
            },
            getGold() {
                if (undefined === gameValue._gold) {
                    gameValue._gold = localStorage.getItem("_gold")
                    if (null === gameValue._gold) {
                        gameValue._gold = 1000000
                    }
                }
                return gameValue._gold
            },
            setGold(gold) {
                gameValue._gold = gold
                localStorage.setItem("_gold", gold)
            },
            getLine() {
                if (undefined === gameValue._line) {
                    gameValue._line = localStorage.getItem("_line")
                    if (null === gameValue._line) {
                        gameValue._line = 1
                    }
                }
                return gameValue._line
            },
            setLine(line) {
                gameValue._line = line
                localStorage.setItem("_line", line)
            },
            getLineBase() {
                if (undefined === gameValue._lineBase) {
                    gameValue._lineBase = localStorage.getItem("_lineBase")
                    if (null === gameValue._lineBase) {
                        gameValue._lineBase = 1000
                    }
                }
                return gameValue._lineBase
            },
            setLineBase(lineBase) {
                gameValue._lineBase = lineBase
                localStorage.setItem("_lineBase", lineBase)
            }
        }

        const closeImage = res["shuiguo_close.png"]
        const close = new ButtonSprite(closeImage, () => {
            console.log("close")
        })
        let closeX = -background.getWidth() / 2, closeY = -background.getHeight() / 2
        closeX += background.getWidth() * 0.05
        closeY += background.getHeight() * 0.07
        close.setPosition(closeX, closeY)
        layout.addChild(close, 1)

        const component = new ImageSprite(res["shuiguo_yaopangun.png"])
        layout.addChild(component, 0)

        const addButtonImage = res["shuiguo_add.png"]
        const subButtonImage = res["shuiguo_jian.png"]
        const add1 = new ButtonSprite(addButtonImage, () => {
            console.log("plus 1")
        })

        let lineArray = [1, 2, 3, 4, 5, 6, 7, 8, 9], lineIndex = gameValue.getLine() - 1
        const add3 = new ButtonSprite(addButtonImage, () => {
            lineIndex += 1
            lineIndex %= lineArray.length
            const value = lineArray[lineIndex]
            gameValue.setLine(value)
            lineCount.setText(value + "")
        })
        const jian3 = new ButtonSprite(subButtonImage, () => {
            lineIndex -= 1
            lineIndex %= lineArray.length
            if (lineIndex < 0) {
                lineIndex += lineArray.length
            }
            const value = lineArray[lineIndex]
            gameValue.setLine(value)
            lineCount.setText(value + "")
        })

        let lineBaseArray = [1000, 2000, 3000, 5000, 10000, 20000, 30000, 50000, 100000], lineBaseIndex = 0
        for (let i = 0; i < lineBaseArray.length; i++) {
            if (lineBaseArray[i] === gameValue.getLineBase()) {
                lineBaseIndex = i
                break
            }
        }
        const add4 = new ButtonSprite(addButtonImage, () => {
            lineBaseIndex += 1
            lineBaseIndex %= lineBaseArray.length
            const value = lineBaseArray[lineBaseIndex]
            gameValue.setLineBase(value)
            lineBaseCount.setText(value + "")
        })
        const jian4 = new ButtonSprite(subButtonImage, () => {
            lineBaseIndex -= 1
            lineBaseIndex %= lineBaseArray.length
            if (lineBaseIndex < 0) {
                lineBaseIndex += lineBaseArray.length
            }
            const value = lineBaseArray[lineBaseIndex]
            gameValue.setLineBase(value)
            lineBaseCount.setText(value + "")
        })

        const buttonIndentation = add1.getWidth() / 2, shuzidiMargin = add1.getWidth() / 3
        const shuzidi1 = new ImageSprite(res["shuiguo_shuzidi.png"])
        let shuzidiX = -background.getWidth() / 2, shuzidiY = background.getHeight() / 2
        shuzidiX += shuzidi1.getWidth()
        shuzidiY -= shuzidi1.getHeight() - 5
        shuzidi1.setPosition(shuzidiX, shuzidiY)
        const myGold = new TextSprite("我的金币")
        myGold.setFontSize(22)
        myGold.setFillStyle("#fff")
        myGold.setStroke('#7d3b16', 4)
        myGold.setPosition(shuzidiX - 15, shuzidiY - shuzidi1.getHeight() + myGold.getHeight() / 2)
        add1.setPosition(shuzidi1.getX() - buttonIndentation + shuzidi1.getWidth() / 2, shuzidi1.getY())

        const myGoldCount = new TextSprite(gameValue.getGold() + "")
        myGoldCount.setFontSize(24)
        myGoldCount.setFillStyle("#ffe897")
        myGoldCount.setPosition(myGold.getX(), shuzidi1.getY())

        const jinbi = new ImageSprite(res["icon_jinbi.png"])
        jinbi.setPosition(shuzidi1.getX() - shuzidi1.getWidth() / 2, shuzidi1.getY())
        const shuzidi2 = new ImageSprite(res["shuiguo_shuzidi.png"])
        shuzidi2.setPosition(shuzidi1.getX() + shuzidi1.getWidth() + shuzidiMargin, shuzidi1.getY())
        const mySeaSoul = new TextSprite("我的海魂")
        mySeaSoul.setFontSize(22)
        mySeaSoul.setFillStyle("#fff")
        mySeaSoul.setStroke('#7d3b16', 4)
        mySeaSoul.setPosition(shuzidi2.getX(), shuzidi2.getY() - shuzidi2.getHeight() + mySeaSoul.getHeight() / 2)

        const mySeaSoulCount = new TextSprite(gameValue.getSeaSoul() + "")
        mySeaSoulCount.setFontSize(24)
        mySeaSoulCount.setFillStyle("#ffe897")
        mySeaSoulCount.setPosition(mySeaSoul.getX(), shuzidi2.getY())

        const zuanshi = new ImageSprite(res["icon_zuanshi.png"])
        zuanshi.setPosition(shuzidi2.getX() + buttonIndentation / 2 - shuzidi2.getWidth() / 2, shuzidi2.getY())
        const shuzidi3 = new ImageSprite(res["shuiguo_shuzidi.png"])
        shuzidi3.setPosition(shuzidi2.getX() + shuzidi2.getWidth() + shuzidiMargin, shuzidi2.getY())
        jian3.setPosition(shuzidi3.getX() + buttonIndentation - shuzidi3.getWidth() / 2, shuzidi3.getY())
        add3.setPosition(shuzidi3.getX() - buttonIndentation + shuzidi3.getWidth() / 2, shuzidi3.getY())
        const lineCountText = new TextSprite("连线数量")
        lineCountText.setFontSize(22)
        lineCountText.setFillStyle("#fff")
        lineCountText.setStroke('#7d3b16', 4)
        lineCountText.setPosition(shuzidi3.getX(), shuzidi3.getY() - shuzidi3.getHeight() + lineCountText.getHeight() / 2)

        const lineCount = new TextSprite(gameValue.getLine() + "")
        lineCount.setFontSize(24)
        lineCount.setFillStyle("#ffe897")
        lineCount.setPosition(lineCountText.getX(), shuzidi3.getY())

        const shuzidi4 = new ImageSprite(res["shuiguo_shuzidi.png"])
        shuzidi4.setPosition(shuzidi3.getX() + shuzidi3.getWidth() + shuzidiMargin, shuzidi3.getY())
        jian4.setPosition(shuzidi4.getX() + buttonIndentation - shuzidi4.getWidth() / 2, shuzidi4.getY())
        add4.setPosition(shuzidi4.getX() - buttonIndentation + shuzidi4.getWidth() / 2, shuzidi4.getY())
        const lineBase = new TextSprite("单线基数")
        lineBase.setFontSize(22)
        lineBase.setFillStyle("#fff")
        lineBase.setStroke('#7d3b16', 4)
        lineBase.setPosition(shuzidi4.getX(), shuzidi4.getY() - shuzidi4.getHeight() + lineBase.getHeight() / 2)

        const lineBaseCount = new TextSprite(gameValue.getLineBase() + "")
        lineBaseCount.setFontSize(24)
        lineBaseCount.setFillStyle("#ffe897")
        lineBaseCount.setPosition(lineBase.getX(), shuzidi4.getY())

        layout.addChild(shuzidi1, 0)
        layout.addChild(myGold, 0)
        layout.addChild(myGoldCount, 0)
        layout.addChild(jinbi, 0)
        layout.addChild(shuzidi2, 0)
        layout.addChild(mySeaSoul, 0)
        layout.addChild(mySeaSoulCount, 0)
        layout.addChild(zuanshi, 0)
        layout.addChild(shuzidi3, 0)
        layout.addChild(lineCountText, 0)
        layout.addChild(lineCount, 0)
        layout.addChild(shuzidi4, 0)
        layout.addChild(lineBase, 0)
        layout.addChild(lineBaseCount, 0)
        layout.addChild(add1, 1)
        layout.addChild(add3, 1)
        layout.addChild(jian3, 1)
        layout.addChild(add4, 1)
        layout.addChild(jian4, 1)

        // let autoFlg = false
        const onceImage = res["shuiguo_dani.png"]
        // const cancelImage = res["shuiguo_quxiao.png"]
        const autoButton = new ButtonSprite(onceImage, () => {
            console.log("start")
            // if (!autoFlg) {
            //     autoFlg = true
            //     autoButton.setClicked(cancelImage)
            //     autoButton.setNotClick(cancelImage)
            // } else {
            //     autoFlg = false
            //     autoButton.setClicked(onceImage)
            //     autoButton.setNotClick(onceImage)
            // }
        })
        let autoButtonX = background.getWidth() / 2, autoButtonY = background.getHeight() / 2
        autoButtonX -= autoButton.getWidth() - 30
        autoButtonY -= autoButton.getHeight() - 20
        autoButton.setPosition(autoButtonX, autoButtonY)
        layout.addChild(autoButton, 1)

        const title = new ImageSprite(res["shuiguo_yaopangun002.png"])
        title.setPosition(0, -background.getHeight() / 2 + title.getHeight() * 0.47)
        const lucky = new ImageSprite(res["shuiguo_cijifenshu.png"])
        lucky.setPosition(title.getX(), title.getY() + title.getHeight() / 2 + lucky.getHeight() / 2)
        layout.addChild(title, 2)
        layout.addChild(lucky, 2)

        const numberFormat = (value) => {
            if (value === 0) {
                return "0"
            }
            let result = [], index = 0
            while (value >= 1) {
                result.push(value % 10)
                if (++index === 3) {
                    result.push(",")
                    index = 0
                }
                value /= 10
            }
            result.reverse()
            return result.join("")
        }

        const goldPool = new TextImageSprite("res/number/number.png")
        goldPool.setText(numberFormat(gameValue.getGoldPool()))
        goldPool.setPosition(title.getX(), title.getY() + 35)
        layout.addChild(goldPool, 2)

        const luckyGold = new TextImageSprite("res/number/number.png")
        luckyGold.setScale(0.8)
        luckyGold.setText(numberFormat(gameValue.getLuckyGold()))
        luckyGold.setPosition(lucky.getX(), lucky.getY())
        layout.addChild(luckyGold, 2)

        const rule = new ButtonSprite(res["shuiguo_guiz.png"], () => {
            console.log("click rule")
        })
        rule.setPosition(-title.getWidth(), title.getY() + rule.getHeight() / 3)
        const info = new ButtonSprite(res["shuiguo_jcxinxi.png"], () => {
            console.log("click info")
        })
        info.setPosition(title.getX() + title.getWidth() - info.getWidth(), rule.getY())
        const setting = new ButtonSprite(res["shuiguo_shezhi.png"], () => {
            console.log("click setting")
        })
        setting.setPosition(info.getX() + info.getWidth() + 20, info.getY())

        layout.addChild(rule, 2)
        layout.addChild(info, 2)
        layout.addChild(setting, 2)

        const grass = new ImageSprite(res["shuiguo_cao.png"])
        let grassX = -background.getWidth() / 2, grassY = -background.getHeight() / 2
        grassX += grass.getWidth() / 2
        grassY += grass.getHeight() / 2
        grass.setPosition(grassX, grassY)
        layout.addChild(grass, 2)

        const grassLeft = new ImageSprite(res["shuiguo_zuocao.png"])
        let grassLeftX = -background.getWidth() / 2, grassLeftY = background.getHeight() / 2
        grassLeftX += grassLeft.getWidth() / 3
        grassLeftY -= grassLeft.getHeight() / 3
        grassLeft.setPosition(grassLeftX, grassLeftY)
        layout.addChild(grassLeft, 2)

        const grassRight = new ImageSprite(res["shuiguo_youcao.png"])
        let grassRightX = background.getWidth() / 2, grassRightY = background.getHeight() / 2
        grassRightX -= grassRight.getWidth() / 3
        grassRightY -= grassRight.getHeight() / 3
        grassRight.setPosition(grassRightX, grassRightY)
        layout.addChild(grassRight, 2)

        scene.addChild(layout)
        GameDrawManager.pushScene(scene)
    })
})()