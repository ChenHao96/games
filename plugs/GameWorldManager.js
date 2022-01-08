window.GameWorldManager = (() => {
    const GameWorldManager = {Direction: {landscape: "landscape", portraiture: "portraiture"}}
    const margin = {top: 0, left: 0}
    GameWorldManager.getMargin = function () {
        return {top: margin.top, left: margin.left}
    }
    let worldDirection = "unknown", fistSetSize = false
    GameWorldManager.getDirection = function () {
        return worldDirection
    }
    let orientationCss = undefined
    GameWorldManager.setDirection = function (direction) {
        if (GameWorldManager.Direction[direction] === direction) {
            worldDirection = direction
            if (undefined === orientationCss) {
                orientationCss = document.createElement("style")
                document.head.appendChild(orientationCss)
            }
            if (GameWorldManager.Direction.portraiture === worldDirection) {
                orientationCss.innerHTML = "*{border:0;padding:0;margin:0;}canvas{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}.audio-controls{top:0;right:0;z-index:-1;position:absolute;}.canvas-panel .canvas-container{width:100vw;height:100vh;}.canvas-panel .canvas-container canvas{height:100vw;width:56.25vw;left:21.875vw;position:absolute;top:calc((100vh - 56.25vw) / 2 - 21.875vw);transform:rotate(-90deg);-o-transform:rotate(-90deg);-ms-transform:rotate(-90deg);-moz-transform:rotate(-90deg);-webkit-transform:rotate(-90deg);}@media only screen and (min-width:177.778vh){.canvas-panel .canvas-container canvas{width:100vh;top:-38.889vh;height:177.778vh;left:calc((100vw - 177.778vh) / 2 + 38.889vh);}}@media only screen and (orientation:portrait){.canvas-panel{display:flex;justify-content:center;}.canvas-panel .canvas-container{display:flex;align-items:center;}.canvas-panel .canvas-container canvas{margin:auto;transform:none;position:initial;width:56.25vh;height:100vh;max-width:100vw;max-height:177.778vw;}}"
            } else if (GameWorldManager.Direction.landscape === worldDirection) {
                orientationCss.innerHTML = "*{border:0;padding:0;margin:0;}canvas{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}.audio-controls{top:0;right:0;z-index:-1;position:absolute;}.canvas-panel{display:flex;justify-content:center;}.canvas-panel .canvas-container{width:100vw;height:100vh;display:flex;align-items:center;}.canvas-panel .canvas-container canvas{margin:auto;width:100vw;height:56.25vw;max-height:100vh;max-width:177.778vh;}@media only screen and (orientation:portrait){.canvas-panel .canvas-container canvas{height:100vw;left:-38.889vw;width:177.778vw;position:absolute;top:calc((100vh - 177.778vw) / 2 + 38.889vw);transform:rotate(90deg);-ms-transform:rotate(90deg);-moz-transform:rotate(90deg);-webkit-transform:rotate(90deg);-o-transform:rotate(90deg);}@media only screen and (max-height:177.778vw){.canvas-panel .canvas-container canvas{width:100vh;top:21.875vh;height:56.25vh;left:calc((100vw - 56.25vh) / 2 - 21.875vh);}}}"
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
    let canvasElement = undefined
    GameWorldManager.getWorldCanvas = function () {
        if (undefined === canvasElement) {
            if (document.body.className) {
                document.body.className += " canvas-panel"
            } else {
                document.body.className = "canvas-panel"
            }
            const canvasContainer = document.createElement("div")
            canvasContainer.className = "canvas-container"
            canvasElement = document.createElement("canvas")
            canvasContainer.appendChild(canvasElement)
            document.body.appendChild(canvasContainer)
        }
        return canvasElement
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
        GameWorldManager.getWorldCanvas().width = canvasWidth
        GameWorldManager.getWorldCanvas().height = canvasHeight
    }
    return GameWorldManager
})()
