window.FramePicture = (() => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    const formatPosition = (position) => {
        const result = {
            mirror: 0,
            scale: {w: 1, h: 1},
            trimmed: position.trimmed,
            rotated: position.rotated,
            frame: {x: position.frame.x, y: position.frame.y},
            sourceSize: {w: position.sourceSize.w, h: position.sourceSize.h},
            spriteSourceSize: {w: position.spriteSourceSize.w, h: position.spriteSourceSize.h}
        }
        if (typeof position.mirror === 'number') {
            result.mirror = position.mirror
        }
        if (typeof position.scale === 'number') {
            result.scale.w = position.scale
            result.scale.h = position.scale
        } else if (typeof position.scale === 'object') {
            if (typeof position.scale.w === 'number') {
                result.scale.w = position.scale.w
            }
            if (typeof position.scale.h === 'number') {
                result.scale.h = position.scale.h
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
                case 1:// 上下镜像
                    dy -= height
                    context.scale(1, -1)
                    break;
                case 2:// 左右镜像
                    dx -= width
                    context.scale(-1, 1)
                    break;
                case 3:// 对角镜像
                    dx -= width
                    dy -= height
                    context.scale(-1, -1)
                    break;
            }
        }
        context.drawImage(img, sx, sy, sw, sh, dx, dy, width, height)
        const image = new Image()
        image.src = canvas.toDataURL()
        return image
    }
})()
