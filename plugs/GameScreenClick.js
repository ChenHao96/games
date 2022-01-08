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
    const list = []
    GameScreenClick.addClickItem = function (sx, sy, ex, ey) {
        const item = {beginX: sx, beginY: sy, endX: ex, endY: ey}
        item.id = clickId++
        list.push(item)
        return item.id
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
                const item = list[i]
                if (getPointOnCanvas(e.target, e.offsetX, e.offsetY, item)) {
                    if (!mobileDevice) {
                        canvas.style.cursor = "pointer"
                        if (item.id !== lastHovered) {
                            lastHovered = item.id
                            window.dispatchEvent(new CustomEvent('GameScreenClick', {
                                detail: {
                                    type: "hovered",
                                    id: item.id
                                }
                            }))
                        }
                    }
                } else {
                    if (lastHovered === item.id) {
                        window.dispatchEvent(new CustomEvent('GameScreenClick', {
                            detail: {
                                type: "leaved",
                                id: item.id
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
                const item = list[i]
                if (getPointOnCanvas(e.target, e.offsetX, e.offsetY, item)) {
                    mouseDown = true
                    window.dispatchEvent(new CustomEvent('GameScreenClick', {
                        detail: {
                            type: "clickDown",
                            id: item.id
                        }
                    }))
                }
            }
        }
        canvas.onmouseup = (e) => {
            if (mouseDown) {
                for (let i = 0; i < list.length; i++) {
                    const item = list[i]
                    if (getPointOnCanvas(e.target, e.offsetX, e.offsetY, item)) {
                        window.dispatchEvent(new CustomEvent('GameScreenClick', {
                            detail: {
                                type: "clicked",
                                id: item.id
                            }
                        }))
                    }
                    window.dispatchEvent(new CustomEvent('GameScreenClick', {
                        detail: {
                            type: "clickLeave",
                            id: item.id
                        }
                    }))
                }
                mouseDown = false
            }
        }
    }
    return GameScreenClick
})()
