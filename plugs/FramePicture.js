window.FramePicture = (() => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    const formatPosition = (position) => {
        const result = {
            mirror: 0,
            trimmed: position.trimmed,
            rotated: position.rotated,
            scale: {w: 1, h: 1},
            frame: {x: position.frame.x, y: position.frame.y},
            spriteSourceSize: {w: position.spriteSourceSize.w, h: position.spriteSourceSize.h},
            sourceSize: {w: position.sourceSize.w, h: position.sourceSize.h}
        }
        if (undefined !== position.mirror) {
            result.mirror = position.mirror
        }
        if (undefined !== position.scale) {
            if (typeof position.scale === 'number') {
                result.scale.w = position.scale
                result.scale.h = position.scale
            } else {
                if (undefined !== position.scale.w) {
                    result.scale.w = position.scale.w
                }
                if (undefined !== position.scale.h) {
                    result.scale.h = position.scale.h
                }
            }
        }
        return result
    }
    return function (img, item) {
        const position = formatPosition(item)
        let sw = position.sourceSize.w, sh = position.sourceSize.h
        let width = position.sourceSize.w, height = position.sourceSize.h
        if (position.trimmed) {
            width = position.spriteSourceSize.w
            height = position.spriteSourceSize.h
            sw = position.spriteSourceSize.w
            sh = position.spriteSourceSize.h
        }
        if (position.scale.w !== 1 && position.scale.h !== 1) {
            width *= position.scale.w
            height *= position.scale.h
        }
        canvas.width = width
        canvas.height = height
        let dx = 0, dy = 0
        let sx = position.frame.x, sy = position.frame.y
        if (position.rotated) {
            context.rotate(-90 * Math.PI / 180)
            dx -= height
            const tmp = sw
            sw = sh
            sh = tmp
            height = canvas.width
            width = canvas.height
        }
        if (position.mirror > 0) {
            switch (position.mirror) {
                case 1:
                    dy -= height
                    context.scale(1, -1)
                    break;
                case 2:
                    dx -= width
                    context.scale(-1, 1)
                    break;
                case 3:
                    dx -= width
                    dy -= height
                    context.scale(-1, -1)
                    break;
            }
        }
        context.drawImage(img, sx, sy, sw, sh, dx, dy, width, height)
        return new Image().src = canvas.toDataURL()
    }
})()
