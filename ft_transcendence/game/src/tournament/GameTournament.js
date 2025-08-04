"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameTournament = void 0;
const Game_1 = require("../game/Game");
class GameTournament extends Game_1.Game {
    constructor(gameScoreboard, gameListener, tournamentId) {
        super(tournamentId);
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
exports.GameTournament = GameTournament;
