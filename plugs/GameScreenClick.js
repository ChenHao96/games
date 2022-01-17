window.GameScreenClick = (() => {
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
    const GameScreenClick = {}, list = {}
    GameScreenClick.clearClicks = function () {
        list.length = 0
    }
    GameScreenClick.addClickItem = function (postFunc) {
        const id = (++clickId) + ""
        list[id] = postFunc
        return id
    }
    GameScreenClick.removeClickItem = function (clickId) {
        delete list[clickId]
    }
    GameScreenClick.activityClick = function () {
        let lastHovered = undefined
        const canvas = GameWorldManager.getWorldCanvas()
        canvas.onmousemove = (e) => {
            for (let itemId in list) {
                const item = list[itemId]()
                if (getPointOnCanvas(e.target, e.offsetX, e.offsetY, item)) {
                    if (itemId !== lastHovered) {
                        lastHovered = itemId
                        window.dispatchEvent(new CustomEvent('GameScreenClick', {
                            detail: {
                                type: "hovered",
                                id: itemId
                            }
                        }))
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
        canvas.onmousedown = (e) => {
            for (let itemId in list) {
                const item = list[itemId]()
                if (getPointOnCanvas(e.target, e.offsetX, e.offsetY, item)) {
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
            for (let itemId in list) {
                const item = list[itemId]()
                if (getPointOnCanvas(e.target, e.offsetX, e.offsetY, item)) {
                    window.dispatchEvent(new CustomEvent('GameScreenClick', {
                        detail: {
                            type: "clickUp",
                            id: itemId
                        }
                    }))
                }
            }
        }
        canvas.onclick = (e) => {
            for (let itemId in list) {
                const item = list[itemId]()
                if (getPointOnCanvas(e.target, e.offsetX, e.offsetY, item)) {
                    window.dispatchEvent(new CustomEvent('GameScreenClick', {
                        detail: {
                            type: "clicked",
                            id: itemId
                        }
                    }))
                }
            }
        }
    }
    return GameScreenClick
})()
