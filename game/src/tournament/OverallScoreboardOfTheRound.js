export class OverallScoreboardOfTheRound {
    allScoreboardInTheRound;
    constructor() {
        this.allScoreboardInTheRound = new Map();
    }
    addGameScoreboard(gameScoreboard) {
        this.allScoreboardInTheRound.set(gameScoreboard.id, gameScoreboard);
    }
    getRoundScoreboardJSONToClients() {
        const json = Array.from(this.allScoreboardInTheRound.values()).map(scoreboard => {
            return {
                userId1: scoreboard.player1.webSocketUserSession.getUserId,
                player1Score: scoreboard.player1Points,
                userId2: scoreboard.player2.webSocketUserSession.getUserId,
                player2Score: scoreboard.player2Points,
            };
        });
        return json;
    }
}
//overall scoreboard of the round
