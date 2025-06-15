import { TournamentPlayer } from "../tournament/TournamentPlayer";
import { GamePlayer } from "./GamePlayer";

export class GameScoreboard {

	private static idCount: number = 1;

	private _id: number;
	private _player1: TournamentPlayer;
	private _player2: TournamentPlayer;
	private _player1Points: number;
	private _player2Points: number;

	constructor(player1: TournamentPlayer, player2: TournamentPlayer) {
		this._id = GameScoreboard.idCount++;
		this._player1 = player1;
		this._player2 = player2;
		this._player1Points = 0;
		this._player2Points = 0;
	}

	public get id() {
		return this._id;
	}

	public playerMakePoint(webSocketUserSession: GamePlayer, points: number = 1) {
		if (webSocketUserSession === this._player1) {
			this._player1Points = this._player1Points + points;
		} else if (webSocketUserSession === this._player2) {
			this._player2Points = this._player2Points + points;
		}
	}

	public getWinner(): TournamentPlayer {
		if (this._player1Points > this._player2Points) {
			return this._player1;
		} else {
			return this._player2;
		}
	}

	public getLoser(): TournamentPlayer {
		if (this._player1Points < this._player2Points) {
			return this._player1;
		} else {
			return this._player2;
		}
	}

	public isDraw(): boolean {
		return (this._player1Points === this._player2Points)
	}

	public get player1(): TournamentPlayer {
		return this._player1;
	}

	public get player2(): TournamentPlayer {
		return this._player2;
	}

	public get player1Points(): number {
		return this._player1Points;
	}

	public get player2Points(): number {
		return this._player2Points;
	}

	getPlayerPoints(tournamentPlayer: TournamentPlayer): number | null {
		if (tournamentPlayer === this.player1) {
			return this._player1Points;
		} else if (tournamentPlayer === this._player2) {
			return this._player2Points;
		}
		return null;
	}
}