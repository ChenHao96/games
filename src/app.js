(function () {
    const res = {
        "icon_jinbi.png": "res/icon_jinbi.png",
        "icon_zuanshi.png": "res/icon_zuanshi.png",

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

    for (let field in res) {
        new Image(res[field])
    }

    GameWorldManager.setDirection(GameWorldManager.Direction.landscape)
    GameWorldManager.setWorldSize(1280, 720)
    GameAudioManager.activityAudio()
    GameScreenClick.activityClick()
    GameDrawManager.run()

    const scene = new GameScene()
    const layout = new GameLayout()
    const background = new ImageSprite(res["shuiguo_bj.jpg"])
    layout.addChild(background, 0)

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
    const add1 = new ButtonSprite(addButtonImage, () => {
        console.log("plus 1")
    })
    const add3 = new ButtonSprite(addButtonImage, () => {
        console.log("plus 3")
    })
    const add4 = new ButtonSprite(addButtonImage, () => {
        console.log("plus 4")
    })
    const subButtonImage = res["shuiguo_jian.png"]
    const jian3 = new ButtonSprite(subButtonImage, () => {
        console.log("sub 3")
    })
    const jian4 = new ButtonSprite(subButtonImage, () => {
        console.log("sub 4")
    })

    const buttonIndentation = add1.getWidth() / 2, shuzidiMargin = add1.getWidth() / 3
    const shuzidi1 = new ImageSprite(res["shuiguo_shuzidi.png"])
    let shuzidiX = -background.getWidth() / 2, shuzidiY = background.getHeight() / 2
    shuzidiX += shuzidi1.getWidth()
    shuzidiY -= shuzidi1.getHeight()
    shuzidi1.setPosition(shuzidiX, shuzidiY)
    const myGoldCount = new TextSprite("我的金币")
    myGoldCount.setFontSize(22)
    myGoldCount.setFillStyle("#fff")
    myGoldCount.setPosition(shuzidiX - 15, shuzidiY - shuzidi1.getHeight() + myGoldCount.getHeight() / 2)
    add1.setPosition(shuzidi1.getX() - buttonIndentation + shuzidi1.getWidth() / 2, shuzidi1.getY())
    const jinbi = new ImageSprite(res["icon_jinbi.png"])
    jinbi.setPosition(shuzidi1.getX() - shuzidi1.getWidth() / 2, shuzidi1.getY())
    const shuzidi2 = new ImageSprite(res["shuiguo_shuzidi.png"])
    shuzidi2.setPosition(shuzidi1.getX() + shuzidi1.getWidth() + shuzidiMargin, shuzidi1.getY())
    const mySeaSoul = new TextSprite("我的海魂")
    mySeaSoul.setFontSize(22)
    mySeaSoul.setFillStyle("#fff")
    mySeaSoul.setPosition(shuzidi2.getX(), shuzidi2.getY() - shuzidi2.getHeight() + mySeaSoul.getHeight() / 2)
    const zuanshi = new ImageSprite(res["icon_zuanshi.png"])
    zuanshi.setPosition(shuzidi2.getX() + buttonIndentation / 2 - shuzidi2.getWidth() / 2, shuzidi2.getY())
    const shuzidi3 = new ImageSprite(res["shuiguo_shuzidi.png"])
    shuzidi3.setPosition(shuzidi2.getX() + shuzidi2.getWidth() + shuzidiMargin, shuzidi2.getY())
    jian3.setPosition(shuzidi3.getX() + buttonIndentation - shuzidi3.getWidth() / 2, shuzidi3.getY())
    add3.setPosition(shuzidi3.getX() - buttonIndentation + shuzidi3.getWidth() / 2, shuzidi3.getY())
    const lineCount = new TextSprite("连线数量")
    lineCount.setFontSize(22)
    lineCount.setFillStyle("#fff")
    lineCount.setPosition(shuzidi3.getX(), shuzidi3.getY() - shuzidi3.getHeight() + lineCount.getHeight() / 2)
    const shuzidi4 = new ImageSprite(res["shuiguo_shuzidi.png"])
    shuzidi4.setPosition(shuzidi3.getX() + shuzidi3.getWidth() + shuzidiMargin, shuzidi3.getY())
    jian4.setPosition(shuzidi4.getX() + buttonIndentation - shuzidi4.getWidth() / 2, shuzidi4.getY())
    add4.setPosition(shuzidi4.getX() - buttonIndentation + shuzidi4.getWidth() / 2, shuzidi4.getY())
    const lineBase = new TextSprite("单线基数")
    lineBase.setFontSize(22)
    lineBase.setFillStyle("#fff")
    lineBase.setPosition(shuzidi4.getX(), shuzidi4.getY() - shuzidi4.getHeight() + lineBase.getHeight() / 2)

    layout.addChild(shuzidi1, 0)
    layout.addChild(myGoldCount, 0)
    layout.addChild(jinbi, 0)
    layout.addChild(shuzidi2, 0)
    layout.addChild(mySeaSoul, 0)
    layout.addChild(zuanshi, 0)
    layout.addChild(shuzidi3, 0)
    layout.addChild(lineCount, 0)
    layout.addChild(shuzidi4, 0)
    layout.addChild(lineBase, 0)
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
})()