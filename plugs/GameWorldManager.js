window.GameWorldManager = (() => {
    const GameWorldManager = {
        Direction: {
            landscape: "landscape",
            portraiture: "portraiture"
        }
    }
    let canvasId = "game-canvas"
    GameWorldManager.getCanvasId = function () {
        return canvasId
    }
    GameWorldManager.setCanvasId = function (id) {
        if (typeof id === "string" && id.length > 0) {
            const canvasElement = document.getElementById(canvasId)
            if (canvasElement) {
                canvasElement.id = id
            }
            canvasId = id
        }
    }
    const margin = {top: 0, left: 0}
    GameWorldManager.getMargin = function () {
        return {top: margin.top, left: margin.left}
    }
    let worldDirection = "unknown", fistSetSize = false
    GameWorldManager.getDirection = function () {
        return worldDirection
    }
    GameWorldManager.setDirection = function (direction) {
        if (GameWorldManager.Direction[direction] === direction) {
            worldDirection = direction
            let orientationCss = document.getElementById("CanvasOrientation")
            if (null === orientationCss || undefined === orientationCss) {
                orientationCss = document.createElement("link")
                orientationCss.id = "CanvasOrientation"
                orientationCss.type = "text/css"
                orientationCss.rel = "stylesheet"
                document.head.appendChild(orientationCss)
            }
            if (GameWorldManager.Direction.portraiture === worldDirection) {
                orientationCss.href = "css/portraiture.css"
            } else if (GameWorldManager.Direction.landscape === worldDirection) {
                orientationCss.href = "css/landscape.css"
            }
            if (fistSetSize) {
                GameWorldManager.setWorldSize(worldWidth, worldHeight)
            }
        }
    }
    let worldWidth = 0, worldHeight = 0
    GameWorldManager.getWorldSize = function () {
        return {width: worldWidth, height: worldHeight}
    }
    GameWorldManager.setWorldSize = function (width, height) {
        worldWidth = Math.floor(Math.abs(width))
        worldHeight = Math.floor(Math.abs(height))
        fistSetSize = true
        let canvasWidth, canvasHeight, hScale = 0, wScale = 0
        if (GameWorldManager.Direction.portraiture === worldDirection) {
            hScale = 1920 * (worldWidth / 1080)
            wScale = 1080 * (worldHeight / 1920)
        } else if (GameWorldManager.Direction.landscape === worldDirection) {
            hScale = 1080 * (worldWidth / 1920)
            wScale = 1920 * (worldHeight / 1080)
        }
        const w = wScale - worldWidth, h = hScale - worldHeight
        if (Math.abs(w) >= Math.abs(h)) {
            canvasHeight = worldHeight
            canvasWidth = wScale
            margin.left = Math.floor(w / 2)
            margin.top = 0
        } else {
            canvasWidth = worldWidth
            canvasHeight = hScale
            margin.top = Math.floor(h / 2)
            margin.left = 0
        }
        let canvasElement = document.getElementById(canvasId)
        if (undefined === canvasElement || null === canvasElement) {
            if (document.body.className) {
                document.body.className += " canvas-panel"
            } else {
                document.body.className = "canvas-panel"
            }
            const canvasContainer = document.createElement("div")
            canvasContainer.className = "canvas-container"
            canvasElement = document.createElement("canvas")
            canvasElement.id = canvasId
            canvasContainer.appendChild(canvasElement)
            document.body.appendChild(canvasContainer)
        }
        canvasElement.width = canvasWidth
        canvasElement.height = canvasHeight
    }
    return GameWorldManager
})()
