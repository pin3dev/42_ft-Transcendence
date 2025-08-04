"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paddle = void 0;
class Paddle {
    constructor(x, y, speed) {
        this._x = x;
        this._y = y;
        this._speed = speed;
    }
    get x() {
        return this._x;
    }
    set x(x) {
        this._x = x;
    }
    get y() {
        return this._y;
    }
    set y(y) {
        this._y = y;
    }
    get speed() {
        return this._speed;
    }
    set speed(speed) {
        this._speed = speed;
    }
}
exports.Paddle = Paddle;
Paddle.SPACE_FROM_SIDE = 30;
Paddle.SPEED = 8;
Paddle.WIDTH = 14;
Paddle.HEIGHT = 90;
