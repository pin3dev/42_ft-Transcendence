import { sourceMapsEnabled } from "process";

export class Player{

	private _x: number;
	private _y: number;
	private _score: number;
	private _speed: number;

	constructor(x: number, y: number, score: number, speed: number){
		this._x = x;
		this._y = y;
		this._score = score;
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

	public get score(): number{
		return this._score;
	}

	public set score(score: number){
		this._score = score;
	}


	public get speed(): number{
		return this._speed;
	}

	public set speed(speed: number){
		this._speed = speed;
	}
}