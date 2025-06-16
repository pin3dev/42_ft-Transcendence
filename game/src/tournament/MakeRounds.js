export class MakeRounds {
    fixPlayers;
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
        // Rotates players (except the first one)
        const rotate = this.fixPlayers.splice(1);
        rotate.unshift(rotate.pop()); // turn right
        this.fixPlayers.splice(1, 0, ...rotate);
        return round;
    }
}
