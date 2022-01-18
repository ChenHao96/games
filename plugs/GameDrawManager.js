window.GameDrawManager = (() => {
    const scenes = [], splashScenes = []
    const GameDrawManager = {ClearStatus: {once: "once", never: "never", every: "every"}}
    const drawNodeFunc = (node, deltaTime, canvasContext) => {
        if (node) {
            node.init()
            node.runBefore()
            node.update(deltaTime)
            node.drawPicture(canvasContext)
            node.foreachChild((item) => {
                drawNodeFunc(item, deltaTime, canvasContext)
            })
        }
    }
    const drawToCanvas = (canvasContext, deltaTime) => {
        let activityScenes = undefined
        if (splashScenes.length > 0) {
            activityScenes = splashScenes[splashScenes.length - 1]
        } else if (scenes.length > 0) {
            activityScenes = scenes[scenes.length - 1]
        }
        drawNodeFunc(activityScenes, deltaTime, canvasContext)
    }
    const waitExitScenes = []
    const pushScene = function (array, scene) {
        if (scene instanceof GameScene) {
            const worldSize = GameWorldManager.getWorldSize()
            scene.setWidth(worldSize.width)
            scene.setHeight(worldSize.height)
            array.push(scene)
            waitExitScenes.push(array[array.length - 2])
        }
    }
    GameDrawManager.pushScene = (scene) => {
        pushScene(scenes, scene)
    }
    const popScene = (array) => {
        if (array && array.length > 0) {
            const scene = array.pop()
            if (scene) {
                waitExitScenes.push(scene)
                return scene
            }
        }
        return undefined
    }
    GameDrawManager.popScene = () => {
        return popScene(scenes)
    }
    GameDrawManager.setTitle = (title) => {
        if (title && typeof title === "string") {
            const titleElements = document.head.getElementsByTagName("title")
            if (titleElements && titleElements.length > 0) {
                titleElements[0].innerHTML = title
            } else {
                const titleElement = document.createElement("title")
                titleElement.innerHTML = title
                document.head.appendChild(titleElement)
            }
        }
    }
    GameDrawManager.setFavicon = (href) => {
        if (href && typeof href === "string") {
            let iconLink = document.getElementById("faviconIco")
            if (null === iconLink || undefined === iconLink) {
                iconLink = document.createElement("link")
                iconLink.rel = "shortcut icon"
                iconLink.type = "image/x-icon"
                document.head.appendChild(iconLink)
            }
            iconLink.href = href
        }
    }
    let managerFps = 60
    GameDrawManager.getFps = () => {
        return managerFps
    }
    GameDrawManager.setFps = (fps) => {
        managerFps = Math.floor(Math.abs(fps))
    }
    let viewClearStatus = GameDrawManager.ClearStatus.never
    GameDrawManager.getClearStatus = () => {
        return viewClearStatus
    }
    GameDrawManager.setClearStatus = (status) => {
        if (GameDrawManager.ClearStatus[status] === status) {
            viewClearStatus = status
        }
    }
    const worldScale = () => {
        let textScale = 1
        const worldDirection = GameWorldManager.getDirection()
        if (GameWorldManager.Direction.portraiture === worldDirection) {
            const baseWidth = GameWorldManager.getWorldSize().width
            textScale = baseWidth / 1080
        } else if (GameWorldManager.Direction.landscape === worldDirection) {
            const baseHeight = GameWorldManager.getWorldSize().height
            textScale = baseHeight / 1920
        }
        return textScale
    }
    const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path")
    svgPath.setAttribute("d", "M678.4 152.192a32.576 32.576 0 0 1 24-9.6 178.304 178.304 0 0 1 126.4 54.4 173.664 173.664 0 0 1 52.8 126.208 33.92 33.92 0 0 1-8 22.4 34.016 34.016 0 0 1-22.4 8 42.432 42.432 0 0 1-24-6.4 30.688 30.688 0 0 1-9.6-22.4 121.888 121.888 0 0 0-33.6-83.2 118.656 118.656 0 0 0-83.2-35.2 27.584 27.584 0 0 1-22.4-9.6 30.688 30.688 0 0 1-9.6-22.4 27.488 27.488 0 0 1 9.6-22.208z m1.6-65.568a30.688 30.688 0 0 1-9.6-22.4 27.552 27.552 0 0 1 9.6-22.4 32.544 32.544 0 0 1 24-9.6 282.976 282.976 0 0 1 203.2 86.4A278.4 278.4 0 0 1 992 321.728a33.888 33.888 0 0 1-8 22.4 33.92 33.92 0 0 1-22.4 8 42.336 42.336 0 0 1-24-6.4 30.688 30.688 0 0 1-9.6-22.4 226.144 226.144 0 0 0-65.6-160 223.392 223.392 0 0 0-160-67.2 27.584 27.584 0 0 1-22.4-9.504z m-252.8 227.2h1.6a331.936 331.936 0 0 0 49.6 99.2 557.152 557.152 0 0 0 3.2 6.4 553.6 553.6 0 0 0 54.4 62.368 602.976 602.976 0 0 0 64 55.968 24.544 24.544 0 0 1 6.4 4.8 18.496 18.496 0 0 1 4.8 3.2V544a381.12 381.12 0 0 0 97.6 44.8 170.944 170.944 0 0 0 84.8 6.4q-11.2-16-32-41.6l-1.6-1.6a1380.864 1380.864 0 0 0-139.2-152v-1.6a1745.92 1745.92 0 0 0-155.2-137.6q-28.8-20.8-43.2-32a157.312 157.312 0 0 0 4.8 84.8z m-332.8 25.6a27.968 27.968 0 0 0 9.6 11.2L201.6 448h-1.6a33.664 33.664 0 0 0 14.4 9.6 31.36 31.36 0 0 0 11.2-8 18.4 18.4 0 0 1 4.8-3.2l16-14.4a18.368 18.368 0 0 1 4.8-3.2l12.8-16a31.424 31.424 0 0 0 8-11.2 25.248 25.248 0 0 0-9.6-12.8l-97.6-99.2A16.544 16.544 0 0 0 140.8 288l-38.4 38.4a28.224 28.224 0 0 0-8 12.8z m-35.2 55.968a70.592 70.592 0 0 1-27.2-54.4 68.512 68.512 0 0 1 25.6-57.6L94.4 243.2q54.4-55.968 115.2 1.6l99.2 99.2a76 76 0 0 1 27.2 56 73.824 73.824 0 0 1-22.4 52.768l40 38.4L412.8 435.2a350.624 350.624 0 0 1-46.4-105.6v1.6q-28.8-102.4 14.4-161.536a20.128 20.128 0 0 1 11.2-9.6 23.424 23.424 0 0 1 14.4-4.8q22.4-3.2 97.6 54.4l1.6 1.536a1846.144 1846.144 0 0 1 160 142.368 1624 1624 0 0 1 145.6 160Q870.4 588.8 867.2 611.2a42.464 42.464 0 0 1-3.2 16 55.68 55.68 0 0 1-11.2 11.2q-59.2 41.6-161.6 11.168v1.6a427.68 427.68 0 0 1-102.4-44.8L529.6 665.6l40 40a69.568 69.568 0 0 1 54.4-20.8 72.032 72.032 0 0 1 56 27.2l99.2 97.536q59.2 59.168 1.6 116.768l-38.4 38.4a72.64 72.64 0 0 1-115.2-1.6L528 864q-57.6-59.168-3.2-113.536L484.8 710.4l-97.6 94.304-3.2 3.2-38.4 38.4v1.696q-65.6 60.8-124.8 0l-49.6-49.664a80.992 80.992 0 0 1-28.8-71.968 79.232 79.232 0 0 1 28.8-51.2l40-40a5.088 5.088 0 0 1 3.2-4.768l92.8-92.8-40-39.968a70.4 70.4 0 0 1-54.4 24 82.976 82.976 0 0 1-57.6-28.8z m630.4-59.392a46.432 46.432 0 1 1 32 12.8 43.392 43.392 0 0 1-32-12.8zM236.8 697.6l-20.8 20.8a33.536 33.536 0 0 0-9.6 14.368v1.632a27.712 27.712 0 0 0 9.6 19.2L265.6 803.2a22.688 22.688 0 0 0 35.2-1.6l19.2-20.8z m372.8 57.6l3.2-1.6-17.6 17.6h-1.6a1.408 1.408 0 0 1-1.6 1.6l-20.8 20.8a16.224 16.224 0 0 0 3.2 25.6h-1.6l99.2 99.2a16 16 0 0 0 25.6 0l40-36.8a19.488 19.488 0 0 0-3.2-27.168v1.6l-99.2-99.2a39.072 39.072 0 0 0-12.8-9.6 28.416 28.416 0 0 0-12.8 7.968z m-73.6-187.104q-22.4-19.2-44.8-41.6-20.8-20.768-38.4-40L380.8 555.2l-3.2 3.2-94.4 96L364.8 736z")
    const logoSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    logoSvg.setAttribute("viewBox", "0 0 1024 1024")
    logoSvg.setAttribute("width", "1080")
    logoSvg.setAttribute("height", "1080")
    logoSvg.appendChild(svgPath)
    const svg_xml = (new XMLSerializer()).serializeToString(logoSvg)
    const logoPath = new Image().src = "data:image/svg+xml;base64," + window.btoa(svg_xml)
    const splashScene = new GameScene()
    splashScene._init = function () {
        const splashLayout = new ColorLayout()
        splashLayout.setColor(new Color(255, 255, 255))
        this.addChild(splashLayout)
        splashLayout._init = function () {
            const textScale = worldScale()
            this.imageSprite = new ImageSprite(logoPath)
            this.imageSprite.setWidth(this.imageSprite.getWidth() * textScale)
            this.imageSprite.setHeight(this.imageSprite.getHeight() * textScale)
            this.addChild(this.imageSprite)
            this.providedText = new TextSprite("Provided by Steven Canvas")
            this.providedText.setFontSize(this.providedText.getFontSize() * textScale)
            this.addChild(this.providedText)
        }
        splashLayout._runBefore = function () {
            this.providedText.setX(this.imageSprite.getX())
            this.providedText.setY(this.getHeight() / 2 - this.providedText.getHeight())
        }
        const colorLayout = new ColorLayout()
        this.layoutColor = new Color(255, 255, 255)
        colorLayout.setColor(this.layoutColor)
        this.addChild(colorLayout)
    }
    splashScene._runBefore = function () {
        this.timeOut = 0
    }
    splashScene.update = function (deltaTime) {
        const stop = 2, time = 1
        const runTime = stop + time * 2
        if (this.timeOut <= time) {
            this.layoutColor.setAlpha(255 - (this.timeOut / time * 255))
        } else if (this.timeOut >= time + stop) {
            this.layoutColor.setAlpha((this.timeOut - time - stop) / time * 255)
        } else {
            this.layoutColor.setAlpha(0)
        }
        if (this.timeOut <= runTime) {
            this.timeOut += deltaTime
        } else {
            this.layoutColor.setAlpha(255)
            GameDrawManager.setClearStatus(GameDrawManager.ClearStatus.once)
            popScene(splashScenes)
        }
    }
    let runnableId = undefined, runnable = false
    GameDrawManager.run = () => {
        if (!runnable) {
            runnable = true
            console.log("Provided by Steven Canvas. Version: 1.1.0")
            pushScene(splashScenes, splashScene)
            const initFps = 1000 / managerFps
            let lastUpdate = Date.now()
            const canvas = GameWorldManager.getWorldCanvas(), canvasContext = canvas.getContext('2d')
            const runExitNodeFunc = (node) => {if (node) {node.runExit();node.foreachChild(runExitNodeFunc)}}
            runnableId = setTimeout(function timeoutFunc() {
                const now = Date.now()
                switch (viewClearStatus) {
                    case GameDrawManager.ClearStatus.once:
                        viewClearStatus = GameDrawManager.ClearStatus.never
                    // noinspection FallThroughInSwitchStatementJS
                    case GameDrawManager.ClearStatus.every:
                        canvasContext.clearRect(0, 0, canvas.width, canvas.height)
                        break
                }
                while (waitExitScenes.length > 0) {runExitNodeFunc(waitExitScenes.pop())}
                drawToCanvas(canvasContext, (now - lastUpdate) / 1000)
                lastUpdate = now
                if (runnable) {
                    const timeout = 1000 / managerFps - (Date.now() - now)
                    runnableId = setTimeout(timeoutFunc, timeout)
                }
            }, initFps)
        }
    }
    GameDrawManager.stop = () => {
        runnable = false
        if (runnableId) {
            clearTimeout(runnableId)
        }
    }
    GameDrawManager.preload = function (resources, callback) {
        let waitCount = 1, finishCount = 0, resObj = {}
        const preloadScene = new GameScene()
        preloadScene._init = function () {
            const colorLayout = new ColorLayout()
            this.addChild(colorLayout)
            colorLayout.setColor(new Color(255, 255, 255))
            colorLayout._init = function () {
                const textScale = worldScale()
                this.imageSprite = new ImageSprite(logoPath)
                this.imageSprite.setWidth(this.imageSprite.getWidth() * textScale)
                this.imageSprite.setHeight(this.imageSprite.getHeight() * textScale)
                this.addChild(this.imageSprite)
                this.providedText = new TextSprite("Loading: 0%...")
                this.providedText.setFontSize(this.providedText.getFontSize() * textScale)
                this.addChild(this.providedText)
            }
            colorLayout._runBefore = function () {
                this.providedText.setX(this.imageSprite.getX())
                this.providedText.setY(this.imageSprite.getHeight() / 2 + this.providedText.getHeight())
            }
            colorLayout.update = function () {
                if (finishCount === waitCount) {
                    this.providedText.setText("Loading: 100%")
                    GameDrawManager.setClearStatus(GameDrawManager.ClearStatus.once)
                    popScene(splashScenes)
                    if (callback && typeof callback === "function") {
                        callback(resObj)
                    }
                } else {
                    this.providedText.setText("Loading: " + Math.floor(finishCount * 10000 / waitCount) / 100 + "%...")
                }
            }
        }
        pushScene(splashScenes, preloadScene)
        if (resources && resources.length > 0) {
            waitCount = resources.length
            for (let i = 0; i < resources.length; i++) {
                const item = resources[i]
                if (typeof item === "string") {
                    const img = new Image()
                    img.src = item
                    img.onload = () => {
                        finishCount += 1
                    }
                } else if (typeof item === "object") {
                    const img = new Image()
                    img.src = item.img
                    img.onload = function () {
                        const xhr = new XMLHttpRequest()
                        xhr.responseType = "json"
                        xhr.withCredentials = true
                        xhr.overrideMimeType('application/json')
                        xhr.onload = () => {
                            if (xhr.status === 200) {
                                const array = xhr.response.frames
                                if (array && array.length > 0) {
                                    waitCount += array.length
                                    for (let j = 0; j < array.length; j++) {
                                        const item = array[j]
                                        resObj[item.filename] = FramePicture(this, item)
                                        finishCount += 1
                                    }
                                }
                                finishCount += 1
                            }
                        }
                        xhr.open("GET", item.frames)
                        xhr.send()
                    }
                }
            }
        } else {
            waitCount = finishCount = 1
        }
    }
    return GameDrawManager
})()
