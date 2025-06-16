"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentPlayer = void 0;
const GamePlayer_1 = require("../game/GamePlayer");
class TournamentPlayer extends GamePlayer_1.GamePlayer {
    constructor(isOnline, webSocketUserSession) {
        super(isOnline, webSocketUserSession);
        this._position = 0;
        this._numOfMatch = 0;
        this._starts = 0;
        this._numberOfVictories = 0;
        this._pointsBalance = 0;
        this._pointsMake = 0;
    }
    get position() {
        return this._position;
    }
    set position(position) {
        this._position = position;
    }
    get numOfMatch() {
        return this._numOfMatch;
    }
    set numOfMatch(numOfMatch) {
        this._numOfMatch = numOfMatch;
    }
    get stars() {
        return this._starts;
    }
    set stars(starts) {
        this._starts = starts;
    }
    get numberOfVictories() {
        return this._numberOfVictories;
    }
    set numberOfVictories(numberOfVictories) {
        this._numberOfVictories = numberOfVictories;
    }
    get pointsBalance() {
        return this._pointsBalance;
    }
    set pointsBalance(pointsBalance) {
        this._pointsBalance = pointsBalance;
    }
    get pointsMake() {
        return this._pointsMake;
    }
    set pointsMake(pointsMake) {
        this._pointsMake = pointsMake;
    }
}
exports.TournamentPlayer = TournamentPlayer;
