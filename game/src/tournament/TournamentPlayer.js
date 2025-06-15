import { GamePlayer } from "../game/GamePlayer.js";
export class TournamentPlayer extends GamePlayer {
    _position = 0;
    _numOfMatch = 0;
    _starts = 0;
    _numberOfVictories = 0;
    _pointsBalance = 0; // example 3x1: the balance is 2 or -2, depends on if the player win or lose
    _pointsMake = 0; // points scored in all matches played
    constructor(isOnline, webSocketUserSession) {
        super(isOnline, webSocketUserSession);
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
