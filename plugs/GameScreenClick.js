window.GameScreenClick = (() => {
    const GameScreenClick = {}
    let gameDirection = undefined
    const getDirection = () => {
        if (gameDirection) {
            return gameDirection
        }
        const orientationCss = document.getElementById("CanvasOrientation")
        if (orientationCss) {
            let direction = orientationCss.href
            direction = direction.substring(direction.lastIndexOf("/"))
            direction = direction.substring(0, direction.indexOf("."))
            gameDirection = direction
        } else {
            gameDirection = "unknown"
        }
        return gameDirection
    }
    const getPointOnCanvas = (canvas, x, y, item) => {
        const bbox = canvas.getBoundingClientRect()
        const position = {x: x / bbox.width * canvas.width, y: y / bbox.height * canvas.height}
        switch (getDirection()) {
            case "portraiture":// 竖屏
                if (bbox.width >= bbox.height) {
                    position.x = x / bbox.height * canvas.width
                    position.y = y / bbox.width * canvas.height
                }
                break
            case "landscape":// 横屏
                if (bbox.height >= bbox.width) {
                    position.x = x / bbox.height * canvas.width
                    position.y = y / bbox.width * canvas.height
                }
                break
        }
        if (position.x >= item.beginX && position.x <= item.endX) {
            if (position.y >= item.beginY && position.y <= item.endY) {
                return true
            }
        }
        return false
    }
    let clickId = 0
    const list = [], listFuncMap = {}
    GameScreenClick.addClickItem = function (postFunc) {
        const id = ++clickId
        list.push(postFunc)
        listFuncMap[postFunc] = id
        return id
    }
    GameScreenClick.removeClickItem = function (postFunc) {
        // TODO: 移除检测
    }
    GameScreenClick.clearClicks = function () {
        list.length = 0
    }
    const mobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    GameScreenClick.activityClick = function () {
        const canvas = GameWorldManager.getWorldCanvas()
        canvas.onmouseleave = () => {
            canvas.style.cursor = ""
        }
        let lastHovered = undefined
        canvas.onmousemove = (e) => {
            canvas.style.cursor = ""
            for (let i = 0; i < list.length; i++) {
                const func = list[i]
                const item = func(), itemId = listFuncMap[func]
                if (getPointOnCanvas(e.target, e.offsetX, e.offsetY, item)) {
                    if (!mobileDevice) {
                        canvas.style.cursor = "pointer"
                        if (itemId !== lastHovered) {
                            lastHovered = itemId
                            window.dispatchEvent(new CustomEvent('GameScreenClick', {
                                detail: {
                                    type: "hovered",
                                    id: itemId
                                }
                            }))
                        }
                    }
                } else {
                    if (lastHovered === itemId) {
                        window.dispatchEvent(new CustomEvent('GameScreenClick', {
                            detail: {
                                type: "leaved",
                                id: itemId
                            }
                        }))
                    }
                    lastHovered = undefined
                }
            }
        }
        let mouseDown = false
        canvas.onmousedown = (e) => {
            for (let i = 0; i < list.length; i++) {
                const func = list[i]
                const item = func(), itemId = listFuncMap[func]
                if (getPointOnCanvas(e.target, e.offsetX, e.offsetY, item)) {
                    mouseDown = true
                    window.dispatchEvent(new CustomEvent('GameScreenClick', {
                        detail: {
                            type: "clickDown",
                            id: itemId
                        }
                    }))
                }
            }
        }
        canvas.onmouseup = (e) => {
            if (mouseDown) {
                for (let i = 0; i < list.length; i++) {
                    const func = list[i]
                    const item = func(), itemId = listFuncMap[func]
                    if (getPointOnCanvas(e.target, e.offsetX, e.offsetY, item)) {
                        window.dispatchEvent(new CustomEvent('GameScreenClick', {
                            detail: {
                                type: "clicked",
                                id: itemId
                            }
                        }))
                    }
                    window.dispatchEvent(new CustomEvent('GameScreenClick', {
                        detail: {
                            type: "clickLeave",
                            id: itemId
                        }
                    }))
                }
                mouseDown = false
            }
        }
    }
    return GameScreenClick
})()
