"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ball = void 0;
class Ball {
    constructor(x, y) {
        this._x = 0;
        this._y = 0;
        this._speedX = Ball.INITIAL_BALL_SPEED;
        this._speedY = Ball.INITIAL_BALL_SPEED;
        this._x = x;
        this._y = y;
        this._speedX = Ball.INITIAL_BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
        this._speedY = Ball.INITIAL_BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
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
    get speedX() {
        return this._speedX;
    }
    set speedX(speedX) {
        this._speedX = speedX;
    }
    get speedY() {
        return this._speedY;
    }
    set speedY(speedY) {
        this._speedY = speedY;
    }
}
exports.Ball = Ball;
Ball.BALL_SIZE = 15;
Ball.INITIAL_BALL_SPEED = 5;
Ball.VX = 5;
Ball.VY = 3;
