const __extends = (function () {
    let extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({__proto__: []} instanceof Array && function (d, b) {
                d.__proto__ = b
            }) ||
            function (d, b) {
                for (let p in b) if (b.hasOwnProperty(p)) d[p] = b[p]
            }
        return extendStatics(d, b)
    }
    return function (d, b) {
        extendStatics(d, b)

        function __() {
            this.constructor = d
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __())
    }
})()
const GameScene = (() => {
    function GameScene() {
        this.scale = {width: 1, height: 1}
        return this
    }

    GameScene.prototype.init = function () {
        if (this.initialized) {
            return
        }
        this.initialized = true
        this._init()
    }
    GameScene.prototype.runBefore = function () {
        if (this.runBefored) {
            return
        }
        this.runBefored = true
        this._runBefore()
    }
    GameScene.prototype.runExit = function () {
        this.runBefored = false
        this._runExit()
    }
    GameScene.prototype.addChild = function (child, index) {
        if (undefined === this.indexNode) {
            this.indexNode = {}
        }
        index = undefined === index ? 0 : index
        let array = this.indexNode[index]
        if (undefined === array) {
            array = []
            this.indexNode[index] = array
        }
        array.push(child)
        child.parent = this
        this.changeNode = true
    }
    GameScene.prototype.removeChild = function (child) {
        if (typeof child === "number" && child >= 0) {
            let doFor = false
            for (let i = child + 1; i < this.nodeArray.length; i++) {
                this.nodeArray[i - 1] = this.nodeArray[i]
                doFor = true
            }
            if (doFor) {
                this.nodeArray.length -= 1
            }
        } else if (child instanceof GameLayout) {
            for (let i = 0; i < this.nodeArray.length; i++) {
                const item = this.nodeArray[i]
                if (item === child) {
                    for (let y = i + 1; y < this.nodeArray.length; y++) {
                        this.nodeArray[y - 1] = this.nodeArray[y]
                    }
                    this.nodeArray.length -= 1
                    break
                }
            }
        }
    }
    GameScene.prototype.foreachChild = function (consumer) {
        if (this.indexNode) {
            const result = this.nodeArray ? this.nodeArray : []
            if (this.changeNode) {
                const indexArray = []
                for (let index in this.indexNode) {
                    indexArray.push(index)
                }
                indexArray.sort()
                result.length = 0
                for (let i = 0; i < indexArray.length; i++) {
                    const key = indexArray[i]
                    const list = this.indexNode[key]
                    for (let j = 0; j < list.length; j++) {
                        result.push(list[j])
                    }
                }
                this.nodeArray = result
                this.changeNode = false
            }
            for (let i = 0; i < result.length; i++) {
                consumer(result[i], i)
            }
        }
    }
    GameScene.prototype.getWidth = function () {
        if (undefined === this.width) {
            if (this.parent) {
                return this.parent.getWidth()
            }
            return 0
        }
        return this.width * this.scale.width
    }
    GameScene.prototype.getHeight = function () {
        if (undefined === this.height) {
            if (this.parent) {
                return this.parent.getHeight()
            }
            return 0
        }
        return this.height * this.scale.height
    }
    GameScene.prototype.setWidth = function (width) {
        this.width = Math.abs(width)
    }
    GameScene.prototype.setHeight = function (height) {
        this.height = Math.abs(height)
    }
    GameScene.prototype.getScale = function () {
        let width = this.scale.width, height = this.scale.height
        if (this.parent) {
            const parentScale = this.parent.getScale()
            width *= parentScale.width
            height *= parentScale.height
        }
        return {width: width, height: height}
    }
    GameScene.prototype.setScale = function (scale) {
        if (typeof scale === 'number') {
            this.scale.width = this.scale.height = scale
        } else {
            if (typeof scale.width === 'number') {
                this.scale.width = scale.width
            }
            if (typeof scale.height === 'number') {
                this.scale.height = scale.height
            }
        }
    }
    GameScene.prototype.getAX = function () {
        return this.getWidth() / 2
    }
    GameScene.prototype.getAY = function () {
        return this.getHeight() / 2
    }
    GameScene.prototype.drawPicture = function (canvasContext) {
    }
    GameScene.prototype._init = function () {
    }
    GameScene.prototype._runBefore = function () {
    }
    GameScene.prototype._runExit = function () {
    }
    GameScene.prototype.destroy = function () {
    }
    GameScene.prototype.update = function (deltaTime) {
    }
    return GameScene
})()
const GamePosition = ((_super) => {
    __extends(GamePosition, _super)

    function GamePosition() {
        const _this = _super.call(this) || this
        this.position = {x: 0, y: 0}
        return _this
    }

    GamePosition.prototype.getX = function () {
        return this.position.x
    }
    GamePosition.prototype.getY = function () {
        return this.position.y
    }
    GamePosition.prototype.setX = function (x) {
        if (typeof x === "number") {
            this.position.x = x
            this.x = x
        }
    }
    GamePosition.prototype.setY = function (y) {
        if (typeof y === "number") {
            this.position.y = y
            this.y = y
        }
    }
    GamePosition.prototype.getPosition = function () {
        return {
            x: this.position.x,
            y: this.position.y
        }
    }
    GamePosition.prototype.setPosition = function (x, y) {
        this.setX(x)
        this.setY(y)
    }
    GamePosition.prototype.getAX = function () {
        return this.getX() + this.parent.getAX()
    }
    GamePosition.prototype.getAY = function () {
        return this.getY() + this.parent.getAY()
    }
    return GamePosition
})(GameScene)
const DrawPicture = ((_super) => {
    __extends(DrawPicture, _super)

    function DrawPicture() {
        return _super.apply(this, arguments) || this
    }

    DrawPicture.prototype.drawPicture = function (canvasContext) {
        const scale = this.getScale()
        const margin = GameWorldManager.getMargin()
        const width = scale.width * this.getWidth(), height = scale.height * this.getHeight()
        const dx = this.getAX() + margin.left - width / 2
        const dy = this.getAY() + margin.top - height / 2
        this._drawPicture(canvasContext, dx, dy)
    }
    DrawPicture.prototype._drawPicture = function (canvasContext, dx, dy) {
    }
    return DrawPicture
})(GamePosition)
const GameLayout = ((_super) => {
    __extends(GameLayout, _super)

    function GameLayout() {
        return _super.apply(this, arguments) || this
    }

    return GameLayout
})(DrawPicture)
const Color = (() => {
    function Color(r, g, b) {
        this.alpha = 1
        this.red = this.green = this.blue = 0
        this.setRed(r)
        this.setGreen(g)
        this.setBlue(b)
        return this
    }

    Color.prototype.setRed = function (red) {
        if (typeof red === "number") {
            this.red = Math.abs(red) % 256
        }
    }
    Color.prototype.setGreen = function (green) {
        if (typeof green === "number") {
            this.green = Math.abs(green) % 256
        }
    }
    Color.prototype.setBlue = function (blue) {
        if (typeof blue === "number") {
            this.blue = Math.abs(blue) % 256
        }
    }
    Color.prototype.setAlpha = function (alpha) {
        if (typeof alpha === "number") {
            this.alpha = (Math.abs(alpha) % 256) / 255
        }
    }
    Color.prototype.getColor = function () {
        return "rgba(" + this.red + "," + this.green + "," + this.blue + "," + this.alpha + ")"
    }
    return Color
})()
const ColorLayout = ((_super) => {
    __extends(ColorLayout, _super)

    function ColorLayout(color) {
        const _this = _super.call(this) || this
        this.setColor(color)
        return _this
    }

    ColorLayout.prototype.setColor = function (color) {
        if (color && color instanceof Color) {
            this.color = color
        }
    }
    ColorLayout.prototype._drawPicture = function (canvasContext, x, y) {
        if (this.color) {
            canvasContext.fillStyle = this.color.getColor()
            const scale = this.getScale()
            const width = scale.width * this.getWidth(), height = scale.height * this.getHeight()
            canvasContext.fillRect(x, y, width, height)
        }
    }
    return ColorLayout
})(GameLayout)
const ImageLayout = ((_super) => {
    __extends(ImageLayout, _super)

    function ImageLayout(src) {
        const _this = _super.call(this) || this
        this.setSrc(src)
        return _this
    }

    ImageLayout.prototype.setSrc = function (src) {
        if (src && typeof src === "string") {
            if (undefined === this._image) {
                this._image = new Image()
            }
            this._image.src = src
        }
    }

    ImageLayout.prototype._drawPicture = function (canvasContext, x, y) {
        if (this._image) {
            canvasContext.drawImage(this._image, x, y, this.getWidth(), this.getHeight())
        }
    }
    return ImageLayout
})(GameLayout)
const GameSprite = ((_super) => {
    __extends(GameSprite, _super)

    function GameSprite() {
        return _super.apply(this, arguments) || this
    }

    return GameSprite
})(DrawPicture)
const TextSprite = ((_super) => {
    __extends(TextSprite, _super)

    function TextSprite(text) {
        const _this = _super.call(this) || this
        this.setFontSize(64)
        this.setFillStyle("#000")
        this.setFontFamily("Arial")
        this.setText(text)
        return _this
    }

    TextSprite.prototype.getText = function () {
        return this._text
    }
    TextSprite.prototype.setText = function (text) {
        if (text && typeof text === "string") {
            this._text = text
            this._calculateViewSize()
        }
    }
    const canvasContext = document.createElement("canvas").getContext("2d")
    TextSprite.prototype._calculateViewSize = function () {
        if (this._text) {
            canvasContext.font = this._fontSize + "px " + this._fontFamily
            const metrics = canvasContext.measureText(this._text)
            this.setWidth(metrics.width)
            this.setHeight(metrics.actualBoundingBoxAscent)
        }
    }
    TextSprite.prototype.getFontSize = function () {
        return this._fontSize
    }
    TextSprite.prototype.setFontSize = function (value) {
        if (typeof value === "number") {
            this._fontSize = value
            this._calculateViewSize()
        }
    }
    TextSprite.prototype.getFillStyle = function () {
        return this._fillStyle
    }
    TextSprite.prototype.setFillStyle = function (value) {
        if (value && typeof value === "string") {
            this._fillStyle = value
        }
    }
    TextSprite.prototype.getFontFamily = function () {
        return this._fontFamily
    }
    TextSprite.prototype.setFontFamily = function (value) {
        if (value && typeof value === "string") {
            this._fontFamily = value
            this._calculateViewSize()
        }
    }
    TextSprite.prototype.setStroke = function (color, lineWidth) {
        this._lineWidth = lineWidth
        this._strokeStyle = color
    }
    TextSprite.prototype._drawPicture = function (canvasContext, x, y) {
        if (this._text) {
            const scale = this.getScale()
            const dy = this.getHeight() * scale.height
            const fontSize = this._fontSize * scale.width
            canvasContext.font = fontSize + "px " + this._fontFamily
            let textX = x, textY = y + dy
            if (this._lineWidth > 0 && this._strokeStyle) {
                canvasContext.lineWidth = this._lineWidth
                canvasContext.strokeStyle = this._strokeStyle
                canvasContext.strokeText(this._text, textX, textY)
            }
            canvasContext.fillStyle = this.getFillStyle()
            canvasContext.fillText(this._text, textX, textY)
        }
    }
    return TextSprite
})(GameSprite)
const TextImageSprite = ((_super) => {
    __extends(TextImageSprite, _super)

    function TextImageSprite(framesUrl) {
        const _this = _super.call(this) || this
        this.inited = false
        this._text_frames = {}
        const frames = this.framesImg = new Image()
        this.framesImg.src = framesUrl
        this.framesImg.onload = () => {
            const request = new XMLHttpRequest()
            request.responseType = "json"
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    const array = request.response.frames
                    for (let i = 0; i < array.length; i++) {
                        const item = array[i], filename = item.filename
                        const char = filename.substring(0, filename.lastIndexOf("."))
                        this._text_frames[char] = window.FramePicture(frames, item)
                    }

                    this.inited = true
                    if (this._text && this._text.length > 0) {
                        this._makeImage(this._text)
                    }
                }
            }
            request.open("GET", frames.src.substring(0, frames.src.lastIndexOf(".")) + ".json")
            request.send()
        }
        return _this
    }

    TextImageSprite.prototype.setText = function (text) {
        if (text && text.length > 0) {
            this._text = text
            if (this.inited) {
                this._makeImage(text)
            }
        } else {
            this._text = undefined
            this._image = undefined
        }
    }
    TextImageSprite.prototype._makeImage = function (text) {
        let canvasHeight = 0, canvasWidth = 0
        for (let i = 0; i < text.length; i++) {
            const char = text.charAt(i)
            const image = this._text_frames[char]
            canvasWidth += image.width
            if (image.height > canvasHeight) {
                canvasHeight = image.height
            }
        }

        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = canvasWidth
        canvas.height = canvasHeight
        this.setWidth(canvasWidth)
        this.setHeight(canvasHeight)

        let beginX = 0
        for (let i = 0; i < text.length; i++) {
            const char = text.charAt(i)
            const image = this._text_frames[char]
            context.drawImage(image, beginX, 0)
            beginX += image.width
        }

        const image = new Image()
        image.src = canvas.toDataURL()
        image.onload = () => {
            this._image = image
        }
    }

    TextImageSprite.prototype._drawPicture = function (canvasContext, x, y) {
        if (this._image) {
            const scale = this.getScale()
            const width = scale.width * this.getWidth(), height = scale.height * this.getHeight()
            canvasContext.drawImage(this._image, x, y, width, height)
        }
    }
    return TextImageSprite
})(GameSprite)
const ImageSprite = ((_super) => {
    __extends(ImageSprite, _super)

    function ImageSprite(src) {
        const _this = _super.call(this) || this
        this.setSrc(src)
        this.placeholder = false
        return _this
    }

    ImageSprite.prototype.setPlaceholder = function (value) {
        this.placeholder = true === value || "true" === value || "true" === value
    }
    ImageSprite.prototype.setSrc = function (src) {
        if (src && typeof src === "string") {
            if (undefined === this._image) {
                this._image = new Image()
            }
            this._image.src = src
            this.setWidth(this._image.width)
            this.setHeight(this._image.height)
            this.placeholder = false
        }
    }
    ImageSprite.prototype._drawPicture = function (canvasContext, x, y) {
        if (this._image && !this.placeholder) {
            const scale = this.getScale()
            const width = scale.width * this.getWidth(), height = scale.height * this.getHeight()
            canvasContext.drawImage(this._image, x, y, width, height)
        }
    }
    return ImageSprite
})(GameSprite)
const Button = ((_super) => {
    __extends(Button, _super)

    function Button() {
        const _this = _super.call(this) || this
        this.setWidth(0)
        this.setHeight(0)
        return _this
    }

    Button.prototype.clickUp = function () {
    }
    Button.prototype.clickDown = function () {
    }
    Button.prototype.clicked = function () {
    }
    Button.prototype.hovered = function () {
    }
    Button.prototype.leaved = function () {
    }
    Button.prototype._runBefore = function () {
        const buttonArea = () => {
            const scale = this.getScale()
            const width = scale.width * this.getWidth(), height = scale.height * this.getHeight()
            const margin = GameWorldManager.getMargin()
            const dx = this.getAX() + margin.left - width / 2, dy = this.getAY() + margin.top - height / 2
            const result = {beginX: dx, beginY: dy}
            result.endX = result.beginX + width
            result.endY = result.beginY + height
            return result
        }
        this.eventListener = ({detail}) => {
            const area = buttonArea()
            if (detail.point.x >= area.beginX && detail.point.x <= area.endX) {
                if (detail.point.y >= area.beginY && detail.point.y <= area.endY) {
                    switch (detail.type) {
                        case "clickDown":
                            this.clickDown()
                            break;
                        case "clickUp":
                            this.clickUp()
                            break;
                        case "clicked":
                            this.clicked()
                            break;
                        case "hovered":
                            this.hovered()
                            break;
                        case "leaved":
                            this.leaved()
                            break;
                    }
                }
            }
        }
        window.addEventListener("GameScreenClick", this.eventListener, false)
    }
    Button.prototype._runExit = function () {
        window.removeEventListener("GameScreenClick", this.eventListener, false)
    }
    return Button
})(GameSprite)
const SwitchSprite = ((_super) => {
    __extends(SwitchSprite, _super)

    function SwitchSprite(open, close, onSwitch) {
        const _this = _super.call(this) || this
        this.setOpenSrc(open)
        this.setCloseSrc(close)
        if (onSwitch && typeof onSwitch === "function") {
            this.onSwitch = onSwitch
        } else {
            this.onSwitch = (value) => {
            }
        }
        this._switch_ = true
        return _this
    }

    SwitchSprite.prototype.leaved = function () {
        this.clickUp()
    }
    SwitchSprite.prototype.clickUp = function () {
        this.setScale(1)
    }
    SwitchSprite.prototype.clickDown = function () {
        this.setScale(0.95)
    }
    SwitchSprite.prototype.clicked = function () {
        this._switch_ = !this._switch_
        this.onSwitch(this._switch_)
    }
    SwitchSprite.prototype.getSwitch = function () {
        return this._switch_
    }
    SwitchSprite.prototype.setSwitch = function (value) {
        this._switch_ = true === value || value === "true" || value === "TRUE"
        this.onSwitch(this._switch_)
    }
    SwitchSprite.prototype.setOpenSrc = function (src) {
        if (src && typeof src === "string") {
            if (undefined === this._openImage) {
                this._openImage = new Image()
            }
            this._openImage.src = src
            this.setWidth(this._openImage.width)
            this.setHeight(this._openImage.height)
        }
    }
    SwitchSprite.prototype.setCloseSrc = function (src) {
        if (src && typeof src === "string") {
            if (undefined === this._closeImage) {
                this._closeImage = new Image()
            }
            this._closeImage.src = src
        }
    }
    SwitchSprite.prototype._drawPicture = function (canvasContext, x, y) {
        const image = this._switch_ ? this._openImage : this._closeImage
        if (image) {
            const scale = this.getScale()
            const width = scale.width * this.getWidth(), height = scale.height * this.getHeight()
            canvasContext.drawImage(image, x, y, width, height)
        }
    }
    return SwitchSprite
})(Button)
const ButtonSprite = ((_super) => {
    __extends(ButtonSprite, _super)

    function ButtonSprite(notClick, clicked, process) {
        const _this = _super.call(this) || this
        this._image = undefined
        this.setNotClick(notClick)
        if (typeof clicked === "function") {
            this._process = clicked
        } else {
            this.setClicked(clicked)
        }
        if (process && typeof process === "function") {
            this._process = process
        }
        if (this._notClick) {
            this._image = this._notClick
            this.setWidth(this._notClick.width)
            this.setHeight(this._notClick.height)
        }
        return _this
    }

    ButtonSprite.prototype.setNotClick = function (src) {
        if (src && typeof src === "string") {
            if (undefined === this._notClick) {
                this._notClick = new Image()
            }
            this._notClick.src = src
        }
    }
    ButtonSprite.prototype.setClickDisable = function (src) {
        if (src && typeof src === "string") {
            if (undefined === this._clickDisable) {
                this._clickDisable = new Image()
            }
            this._clickDisable.src = src
        }
    }
    ButtonSprite.prototype.setClicked = function (src) {
        if (src && typeof src === "string") {
            if (undefined === this._clicked) {
                this._clicked = new Image()
            }
            this._clicked.src = src
        }
    }
    ButtonSprite.prototype.leaved = function () {
        this.clickUp()
    }
    ButtonSprite.prototype.clickUp = function () {
        if (this._disable_) {
            return
        }
        this.setScale(1)
        this._image = this._notClick
        this.setWidth(this._notClick.width)
        this.setHeight(this._notClick.height)
    }
    ButtonSprite.prototype.clickDown = function () {
        if (this._disable_) {
            return
        }
        if (this._clicked) {
            this._image = this._clicked
            this.setWidth(this._clicked.width)
            this.setHeight(this._clicked.height)
        } else {
            this.setScale(0.95)
        }
    }
    ButtonSprite.prototype.clicked = function () {
        if (this._disable_) {
            return
        }
        this._process()
    }
    ButtonSprite.prototype._drawPicture = function (canvasContext, x, y) {
        if (this._image) {
            const scale = this.getScale()
            const width = scale.width * this.getWidth(), height = scale.height * this.getHeight()
            canvasContext.drawImage(this._image, x, y, width, height)
        }
    }
    ButtonSprite.prototype.setDisable = function (disable) {
        this._disable_ = true === disable || disable === "true" || disable === "TRUE"
        if (this._disable_) {
            if (this._clickDisable) {
                this._image = this._clickDisable
                this.setWidth(this._clickDisable.width)
                this.setHeight(this._clickDisable.height)
            }
        }
    }
    return ButtonSprite
})(Button)
