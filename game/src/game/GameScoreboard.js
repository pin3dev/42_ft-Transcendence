export class GameScoreboard {
    static idCount = 1;
    _id;
    _player1;
    _player2;
    _player1Points;
    _player2Points;
    constructor(player1, player2) {
        this._id = GameScoreboard.idCount++;
        this._player1 = player1;
        this._player2 = player2;
        this._player1Points = 0;
        this._player2Points = 0;
    }
    get id() {
        return this._id;
    }
    playerMakePoint(webSocketUserSession, points = 1) {
        if (webSocketUserSession === this._player1) {
            this._player1Points = this._player1Points + points;
        }
        else if (webSocketUserSession === this._player2) {
            this._player2Points = this._player2Points + points;
        }
    }
    getWinner() {
        if (this._player1Points > this._player2Points) {
            return this._player1;
        }
        else {
            return this._player2;
        }
    }
    getLoser() {
        if (this._player1Points < this._player2Points) {
            return this._player1;
        }
        else {
            return this._player2;
        }
    }
    isDraw() {
        return (this._player1Points === this._player2Points);
    }
    get player1() {
        return this._player1;
    }
    get player2() {
        return this._player2;
    }
    get player1Points() {
        return this._player1Points;
    }
    get player2Points() {
        return this._player2Points;
    }
    getPlayerPoints(tournamentPlayer) {
        if (tournamentPlayer === this.player1) {
            return this._player1Points;
        }
        else if (tournamentPlayer === this._player2) {
            return this._player2Points;
        }
        return null;
    }
}
