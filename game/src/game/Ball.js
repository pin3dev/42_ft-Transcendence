export class Ball {
    static BALL_SIZE = 15;
    static INITIAL_BALL_SPEED = 5;
    static VX = 5;
    static VY = 3;
    _x = 0;
    _y = 0;
    _speedX = Ball.INITIAL_BALL_SPEED;
    _speedY = Ball.INITIAL_BALL_SPEED;
    constructor(x, y) {
        this._x = x;
        this._y = y;
        // randomly chooses a direction (x and y) for the ball to start
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
