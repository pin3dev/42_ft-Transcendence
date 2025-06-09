
export class Paddle{

	public static readonly SPACE_FROM_SIDE = 30;
	public static readonly SPEED = 8;

	public static readonly WIDTH: number = 14;
    public static readonly HEIGHT: number = 90;

	private _x: number;
	private _y: number;
	private _speed: number;

	constructor(x: number, y: number, speed: number){
		this._x = x;
		this._y = y;
		this._speed = speed;
	}

	public get x(): number{
		return this._x;
	}
	public set x(x: number){
		this._x = x;
	}

	public get y(): number{
		return this._y;
	}

	public set y(y: number){
		this._y = y;
	}

	public get speed(): number{
		return this._speed;
	}

	public set speed(speed: number){
		this._speed = speed;
	}
}