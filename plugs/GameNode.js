const __extends = (function () {
    let extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({__proto__: []} instanceof Array && function (d, b) {
                d.__proto__ = b
            }) ||
            function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]
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
        this.indexNode = {}

        this._init = () => {
        }
        this._runBefore = () => {
        }
        this.update = (deltaTime) => {
        }
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
    }
    GameScene.prototype.addChild = function (child, index) {
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
    GameScene.prototype.foreachChild = function (consumer) {
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
    GameScene.prototype.getWidth = function () {
        if (undefined === this.width) {
            if (this.parent) {
                return this.parent.getWidth()
            }
            return 0
        }
        return this.width
    }
    GameScene.prototype.getHeight = function () {
        if (undefined === this.height) {
            if (this.parent) {
                return this.parent.getHeight()
            }
            return 0
        }
        return this.height
    }
    GameScene.prototype.setWidth = function (width) {
        this.width = Math.abs(width)
    }
    GameScene.prototype.setHeight = function (height) {
        this.height = Math.abs(height)
    }
    return GameScene
})()
const GamePosition = ((_super) => {
    __extends(GamePosition, _super)

    function GamePosition() {
        const _this = _super.call(this) || this
        _this.position = {x: 0, y: 0}
        return _this
    }

    GamePosition.prototype.getX = function () {
        return this.position.x
    }
    GamePosition.prototype.setX = function (x) {
        if (x && typeof x === "number") {
            this.position.x = x
        }
    }
    GamePosition.prototype.getY = function () {
        return this.position.y
    }
    GamePosition.prototype.setY = function (y) {
        if (y && typeof y === "number") {
            this.position.y = y
        }
    }
    GamePosition.prototype.getPosition = function () {
        return {
            x: this.position.x,
            y: this.position.y
        }
    }
    GamePosition.prototype.setPosition = function (position, y) {
        if (position && typeof position === "number") {
            this.position.x = position
            if (y && typeof y === "number") {
                this.position.y = y
            } else {
                this.position.y = position
            }
        } else {
            this.position.x = position.x
            this.position.y = position.y
        }
    }
    return GamePosition
})(GameScene)
const DrawPicture = ((_super) => {
    __extends(DrawPicture, _super)

    function DrawPicture() {
        return _super.apply(this, arguments) || this
    }

    DrawPicture.prototype.drawPicture = function (canvasContext) {
        let ppx = 0, ppy = 0, px = this.parent.getWidth() / 2, py = this.parent.getHeight() / 2
        if (undefined !== this.parent.parent) {
            ppx = this.parent.parent.getWidth() / 2
            ppy = this.parent.parent.getHeight() / 2
            px = this.parent.getX()
            py = this.parent.getY()
        }
        const dx = this.getX() + px + ppx - this.getWidth() / 2, dy = this.getY() + py + ppy - this.getHeight() / 2
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
        this.red = this.green = this.blue = 0
        this.setRed(r)
        this.setGreen(g)
        this.setBlue(b)
        return this
    }

    Color.prototype.setRed = function (red) {
        if (red && typeof red === "number") {
            this.red = Math.abs(red) % 256
        }
    }
    Color.prototype.setGreen = function (green) {
        if (green && typeof green === "number") {
            this.green = Math.abs(green) % 256
        }
    }
    Color.prototype.setBlue = function (blue) {
        if (blue && typeof blue === "number") {
            this.blue = Math.abs(blue) % 256
        }
    }
    Color.prototype.setAlpha = function (alpha) {
        if (alpha && typeof alpha === "number") {
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

    function ColorLayout() {
        return _super.apply(this, arguments) || this
    }

    ColorLayout.prototype.setColor = function (color) {
        if (color && color instanceof Color) {
            this.color = color
        }
    }

    ColorLayout.prototype._drawPicture = function (canvasContext, x, y) {
        if (this.color) {
            canvasContext.fillStyle = this.color.getColor()
            canvasContext.fillRect(x, y, this.getWidth(), this.getHeight())
        }
    }
    return ColorLayout
})(GameLayout)
const ImageLayout = ((_super) => {
    __extends(ImageLayout, _super)

    function ImageLayout(src) {
        const _this = _super.call(this) || this
        _this.setSrc(src)
        return _this
    }

// TODO: 拉伸 平铺
// TODO: 偏移
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
        _this._fontSize = 64
        _this._fillStyle = "#000"
        _this._fontWeight = "bold"
        _this._fontFamily = "Georgia"
        _this.setText(text)
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
            canvasContext.font = this._fontSize + "px " + this._fontWeight + " " + this._fontFamily
            const metrics = canvasContext.measureText(this._text)
            this.setWidth(metrics.width)
            this.setHeight(metrics.actualBoundingBoxAscent)
        }
    }
    TextSprite.prototype.getFontSize = function () {
        return this._fontSize
    }
    TextSprite.prototype.setFontSize = function (value) {
        if (value && typeof value === "number") {
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
    TextSprite.prototype.getFontWeight = function () {
        return this._fontWeight
    }
    TextSprite.prototype.setFontWeight = function (value) {
        if (value && typeof value === "string") {
            this._fontWeight = value
            this._calculateViewSize()
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
    TextSprite.prototype._drawPicture = function (canvasContext, x, y) {
        if (this._text) {
            canvasContext.fillStyle = this.getFillStyle()
            canvasContext.font = this._fontSize + "px " + this._fontWeight + " " + this._fontFamily
            canvasContext.fillText(this._text, x, y)
        }
    }
    return TextSprite
})(GameSprite)
const ImageSprite = ((_super) => {
    __extends(ImageSprite, _super)

    function ImageSprite(src) {
        const _this = _super.call(this) || this
        _this.setSrc(src)
        return _this
    }

    ImageSprite.prototype.setSrc = function (src) {
        if (src && typeof src === "string") {
            if (undefined === this._image) {
                this._image = new Image()
            }
            this._image.src = src
            this.setWidth(this._image.width)
            this.setHeight(this._image.height)
        }
    }
    ImageSprite.prototype._drawPicture = function (canvasContext, x, y) {
        if (this._image) {
            canvasContext.drawImage(this._image, x, y, this.getWidth(), this.getHeight())
        }
    }
    return ImageSprite
})(GameSprite)