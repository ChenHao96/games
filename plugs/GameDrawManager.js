function GameScene() {

}

GameScene.prototype.runExit = function () {

}

window.GameDrawManager = (() => {
    const GameDrawManager = {
        ClearStatus: {
            once: "once",
            never: "never",
            every: "every"
        }
    }
    const drawToCanvas = (canvasContext, deltaTime) => {
        console.log(deltaTime)
    }
    const scenes = []
    GameDrawManager.pushScene = (scene) => {
        if (scene instanceof GameScene) {
            scenes.push(scene)
        }
    }
    GameDrawManager.popScene = () => {
        const scene = scenes.pop()
        if (scene) {
            scene.runExit()
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
    let runnableId = undefined, runnable = false
    GameDrawManager.run = (canvas) => {
        runnable = true
        const initFps = 1000 / managerFps
        let deltaTime = 0, lastUpdate = Date.now()
        const canvasContext = canvas.getContext('2d')
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
            deltaTime = (now - lastUpdate) / 1000
            drawToCanvas(canvasContext, deltaTime)
            lastUpdate = now
            if (runnable) {
                const timeout = 1000 / managerFps - (Date.now() - now)
                runnableId = setTimeout(timeoutFunc, timeout)
            }
        }, initFps)
    }
    GameDrawManager.stop = () => {
        runnable = false
        if (runnableId) {
            clearTimeout(runnableId)
        }
    }
    return GameDrawManager
})()
