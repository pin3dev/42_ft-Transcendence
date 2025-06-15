import { Game } from "../game/Game";
import { GamePlayer } from "../game/GamePlayer";
import { GameScoreboard } from "../game/GameScoreboard";
import { GameTournamentListener } from "./GameTournamentListener";

export class GameTournament extends Game{

	private _gameScoreboard : GameScoreboard;
	private _gameListener: GameTournamentListener;

	constructor(gameScoreboard : GameScoreboard, gameListener : GameTournamentListener){
		super();
		this._gameScoreboard = gameScoreboard;
		this._gameListener = gameListener;
	}

	public playerMakePoint(player: GamePlayer): void {
		this._gameScoreboard.playerMakePoint(player);
		this._gameListener.playerMakePoint(this._gameScoreboard);
	}

	public gameEnd(): void {
		console.warn('GameTournament: gameEnd');
		console.warn(this._gameScoreboard);
		this._gameListener.playEnded(this._gameScoreboard);
	}

}