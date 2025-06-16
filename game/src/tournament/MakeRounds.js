"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeRounds = void 0;
class MakeRounds {
    constructor(tournamentPlayer) {
        if (tournamentPlayer !== null) {
            this.fixPlayers = [...tournamentPlayer];
        }
        else {
            this.fixPlayers = [];
        }
    }
    getARound() {
        const middle = this.fixPlayers.length / 2;
        const round = [];
        for (let i = 0; i < middle; i++) {
            const player1 = this.fixPlayers[i];
            const player2 = this.fixPlayers[this.fixPlayers.length - 1 - i];
            round.push([player1, player2]);
        }
        const rotate = this.fixPlayers.splice(1);
        rotate.unshift(rotate.pop());
        this.fixPlayers.splice(1, 0, ...rotate);
        return round;
    }
}
exports.MakeRounds = MakeRounds;
