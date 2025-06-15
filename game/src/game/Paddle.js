export class Paddle {
    static SPACE_FROM_SIDE = 30;
    static SPEED = 8;
    static WIDTH = 14;
    static HEIGHT = 90;
    _x;
    _y;
    _speed;
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
