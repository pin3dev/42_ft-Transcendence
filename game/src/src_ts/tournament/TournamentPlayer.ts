import { GamePlayer } from "../game/GamePlayer";
import { WebSocketUserSession } from "../WebSocketUserSession";

export class TournamentPlayer extends GamePlayer{

	private _position: number = 0;
	private _numOfMatch: number = 0;
	private _starts: number = 0;
	private _numberOfVictories: number = 0;
	private _pointsBalance: number = 0;    // example 3x1: the balance is 2 or -2, depends on if the player win or lose
	private _pointsMake: number = 1;       // points scored in all matches played

	constructor(isOnline: boolean, webSocketUserSession: WebSocketUserSession) {
		super(isOnline, webSocketUserSession);
	}

	public get position(): number {
		return this._position;
	}

	public set position(position: number) {
		this._position = position;
	}

	public get numOfMatch(): number {
		return this._numOfMatch;
	}

	public set numOfMatch(numOfMatch: number) {
		this._numOfMatch = numOfMatch;
	}

	public get starts(): number {
		return this._starts;
	}

	public set starts(starts: number) {
		this._starts = starts;
	}

	public get numberOfVictories(): number {
		return this._numberOfVictories;
	}

	public set numberOfVictories(numberOfVictories: number) {
		this._numberOfVictories = numberOfVictories;
	}

	public get pointsBalance(): number {
		return this._pointsBalance;
	}

	public set pointsBalance(pointsBalance: number) {
		this._pointsBalance = pointsBalance;
	}

	public get pointsMake(): number {
		return this._pointsMake;
	}

	public set pointsMake(pointsMake: number) {
		this._pointsMake = pointsMake;
	}
}