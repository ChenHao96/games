window.GameScreenClick = (() => {
    const GameScreenClick = {}
    const getPointOnCanvas = (canvas, x, y, item) => {
        const bbox = canvas.getBoundingClientRect()
        const position = {x: x / bbox.width * canvas.width, y: y / bbox.height * canvas.height}
        switch (GameWorldManager.getDirection()) {
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
            default:
                return false
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
    GameScreenClick.clearClicks = function () {
        list.length = 0
    }
    GameScreenClick.addClickItem = function (postFunc) {
        const id = ++clickId
        list.push(postFunc)
        return id
    }
    GameScreenClick.removeClickItem = function (clickId) {
        let move = false
        for (let i = 0; i < list.length; i++) {
            const item = list[i]()
            if (item.clickId === clickId) {
                list[i] = undefined
                move = true
            }
            if (move) {
                if (i <= list.length - 2) {
                    list[i] = list[i + 1]
                } else {
                    list.length -= 1
                }
            }
        }
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
                const item = list[i](), itemId = item.clickId
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
                        lastHovered = undefined
                    }
                }
            }
        }
        let mouseDown = false, lastClickId = undefined
        canvas.onmousedown = (e) => {
            for (let i = 0; i < list.length; i++) {
                const item = list[i](), itemId = item.clickId
                if (getPointOnCanvas(e.target, e.offsetX, e.offsetY, item)) {
                    mouseDown = true
                    lastClickId = itemId
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
                    const item = list[i](), itemId = item.clickId
                    if (getPointOnCanvas(e.target, e.offsetX, e.offsetY, item)) {
                        if (itemId === lastClickId) {
                            window.dispatchEvent(new CustomEvent('GameScreenClick', {
                                detail: {
                                    type: "clickUp",
                                    id: itemId
                                }
                            }))
                            window.dispatchEvent(new CustomEvent('GameScreenClick', {
                                detail: {
                                    type: "clicked",
                                    id: itemId
                                }
                            }))
                        }
                    }
                }
                mouseDown = false
            }
        }
    }
    return GameScreenClick
})()
