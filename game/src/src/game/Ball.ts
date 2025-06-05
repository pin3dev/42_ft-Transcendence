
export class Ball{

	public static readonly BALL_SIZE = 15;
	public static readonly INITIAL_BALL_SPEED = 5

    public static readonly VX: number = 5;
    public static readonly VY: number = 3;

    private _x: number = 0;
    private _y: number = 0;
	private _speedX: number = Ball.INITIAL_BALL_SPEED;
	private _speedY: number = Ball.INITIAL_BALL_SPEED;

    constructor(x: number, y: number){
        this._x = x;
        this._y = y;

		// randomly chooses a direction (x and y) for the ball to start
		this._speedX = Ball.INITIAL_BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
		this._speedY = Ball.INITIAL_BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
    }

    public get x(){
        return this._x;
    }

    public set x(x: number){
        this._x = x;
    }

    public get y(){
        return this._y;
    }

    public set y(y: number){
        this._y = y;
    }

	public get speedX(){
        return this._speedX;
    }

    public set speedX(speedX: number){
        this._speedX = speedX;
    }

	public get speedY(){
        return this._speedY;
    }

    public set speedY(speedY: number){
        this._speedY = speedY;
    }

}