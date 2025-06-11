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
		this._gameListener.playerEnd(this._gameScoreboard);
	}

}