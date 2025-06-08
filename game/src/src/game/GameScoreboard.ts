import { WebSocketUserSession } from "../WebSocketUserSession";
import { Game } from "./Game";

export class GameScoreboard {

	private _player1: WebSocketUserSession;
	private _player2: WebSocketUserSession;
	private _player1Points: number;
	private _player2Points: number;

	constructor(player1: WebSocketUserSession, player2: WebSocketUserSession) {
		this._player1 = player1;
		this._player2 = player2;
		this._player1Points = 0;
		this._player2Points = 0;
	}

	public playerMakePoint(webSocketUserSession: WebSocketUserSession, points: number = 1) {
		if (webSocketUserSession === this._player1) {
			this._player1Points += points;
		} else if (webSocketUserSession == this._player2) {
			this._player2Points += points;
		}
	}

	public getWinner(): WebSocketUserSession | null {
		if (this._player1Points >= Game.WINNING_SCORE) {
			return this._player1;
		} else if (this._player2Points >= Game.WINNING_SCORE) {
			return this._player2;
		}
		return null;
	}

	public getLoser() : WebSocketUserSession | null {
		if (this._player1Points < Game.WINNING_SCORE) {
			return this._player1;
		} else if (this._player2Points < Game.WINNING_SCORE) {
			return this._player2;
		}
		return null;
	}

	public isDraw(): boolean {
		return (this._player1Points + this._player2Points == Game.MAX_POINTS)
	}

	public get player1(): WebSocketUserSession{
		return this._player1;
	}

	public get player2(): WebSocketUserSession{
		return this._player1;
	}

	getPlayerPoints(webSocketUserSession: WebSocketUserSession): number | null {
		if (webSocketUserSession === this.player1) {
			return this._player1Points;
		} else if (webSocketUserSession === this._player2) {
			return this._player2Points;
		}
		return null;
	}
}