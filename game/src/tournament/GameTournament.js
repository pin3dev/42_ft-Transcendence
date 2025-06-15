import { Game } from "../game/Game.js";
export class GameTournament extends Game {
    _gameScoreboard;
    _gameListener;
    constructor(gameScoreboard, gameListener) {
        super();
        this._gameScoreboard = gameScoreboard;
        this._gameListener = gameListener;
    }
    playerMakePoint(player) {
        this._gameScoreboard.playerMakePoint(player);
        this._gameListener.playerMakePoint(this._gameScoreboard);
    }
    gameEnd() {
        this._gameListener.playEnded(this._gameScoreboard);
    }
}
