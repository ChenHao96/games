window.GameScreenClick = (() => {
    const getPointOnCanvas = (canvas, x, y) => {
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
                return undefined
        }
        return position
    }
    const GameScreenClick = {}
    GameScreenClick.activityClick = function () {
        const lastPoint = {x: -1, y: -1}
        const canvas = GameWorldManager.getWorldCanvas()
        canvas.onmousemove = (e) => {
            const point = getPointOnCanvas(e.target, e.offsetX, e.offsetY)
            if (undefined !== point) {
                window.dispatchEvent(new CustomEvent('GameScreenClick', {
                    detail: {
                        type: "hovered",
                        point: point
                    }
                }))
                if (lastPoint.x > 0 && lastPoint.y > 0) {
                    window.dispatchEvent(new CustomEvent('GameScreenClick', {
                        detail: {
                            type: "leaved",
                            point: lastPoint
                        }
                    }))
                }
                lastPoint.x = point.x
                lastPoint.y = point.y
            }
        }
        canvas.onmousedown = (e) => {
            const point = getPointOnCanvas(e.target, e.offsetX, e.offsetY)
            if (undefined !== point) {
                window.dispatchEvent(new CustomEvent('GameScreenClick', {
                    detail: {
                        type: "clickDown",
                        point: point
                    }
                }))
            }
        }
        canvas.onmouseup = (e) => {
            const point = getPointOnCanvas(e.target, e.offsetX, e.offsetY)
            if (undefined !== point) {
                window.dispatchEvent(new CustomEvent('GameScreenClick', {
                    detail: {
                        type: "clickUp",
                        point: point
                    }
                }))
            }
        }
        canvas.onclick = (e) => {
            const point = getPointOnCanvas(e.target, e.offsetX, e.offsetY)
            if (undefined !== point) {
                window.dispatchEvent(new CustomEvent('GameScreenClick', {
                    detail: {
                        type: "clicked",
                        point: point
                    }
                }))
            }
        }
    }
    return GameScreenClick
})()
