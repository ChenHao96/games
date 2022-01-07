function Rebound() {
    this._quality_ = 0
    this._rotation_ = 0
    this._initialized_ = false
    this._endPosition_ = {x: 0, y: 0}
    this._beginPosition_ = {x: 0, y: 0}
    this._size_ = {width: 0, height: 0}
}

Rebound.prototype.setBeginPosition = function (position) {
    this._beginPosition_.x = position.x
    this._beginPosition_.y = position.y
}
Rebound.prototype.setEndPosition = function (position) {
    this._endPosition_.x = position.x
    this._endPosition_.y = position.y
}
Rebound.prototype.setRotation = function (rotation) {
    this._rotation_ = rotation
}
Rebound.prototype.setQuality = function (quality) {
    this._quality_ = quality
}
Rebound.prototype.setSize = function (size) {
    this._size_.width = size.width
    this._size_.height = size.height
}
Rebound.prototype.init = function () {
    if (!this._initialized_) {
        this._initialized_ = true
        this._reboundH_ = 0.7
        this._reboundCount_ = 0
        this._reboundStep_ = 50
        this._reboundSpeed_ = 10
        this._reboundHeight_ = (this._endPosition_.y - this._beginPosition_.y) * this._reboundH_
    }
}
Rebound.prototype.getCurrentPosition = function (deltaTime) {
    if (this._reboundCount_ < 7) {
        if (this._reboundCount_ % 2 === 0) {
            if (this._beginPosition_.y < this._endPosition_.y) {
                let valueY = this._beginPosition_.y + this._reboundStep_ * deltaTime
                if (valueY > this._endPosition_.y) {
                    valueY = this._endPosition_.y
                }
                this._beginPosition_.y = valueY
            } else {
                this._reboundCount_ += 1
                this._reboundStep_ -= this._reboundSpeed_
            }
        } else {
            if (this._beginPosition_.y > this._reboundHeight_) {
                this._beginPosition_.y -= this._reboundStep_ * deltaTime
            } else {
                this._reboundCount_ += 1
                this._reboundHeight_ += (this._endPosition_.y - this._reboundHeight_) * this._reboundH_
            }
        }
        return {
            x: this._beginPosition_.x,
            y: this._beginPosition_.y
        }
    } else {
        return {
            x: this._endPosition_.x,
            y: this._endPosition_.y
        }
    }
}