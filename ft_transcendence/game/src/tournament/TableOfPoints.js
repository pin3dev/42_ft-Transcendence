"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableOfPoints = void 0;
const SortTablePointMemberArray_1 = require("./SortTablePointMemberArray");
class TableOfPoints {
    constructor() {
        this._playersOfTournament = [];
    }
    addPlayer(tournamentPlayer) {
        this._playersOfTournament.push(tournamentPlayer);
    }
    removerPlayer(tournamentPlayer) {
        const index = this._playersOfTournament.indexOf(tournamentPlayer);
        if (index !== -1) {
            this._playersOfTournament.splice(index, 1);
        }
    }
    addPlayerScore(gameScoreboard) {
        if (this.areBothPlayersOffline(gameScoreboard))
            return;
        if (gameScoreboard.isDraw()) {
            this.makeDraw(gameScoreboard.player1, gameScoreboard);
            this.makeDraw(gameScoreboard.player2, gameScoreboard);
        }
        else {
            let playerWinner = gameScoreboard.getWinner();
            let playerLoser = gameScoreboard.getLoser();
            this.makeVictory(playerWinner, playerLoser, gameScoreboard);
        }
    }
    areBothPlayersOffline(gameScoreboard) {
        return (!gameScoreboard.player1.isOnline && !gameScoreboard.player2.isOnline);
    }
    getTableJSONToclients() {
        const sortedTable = this.getTableSorted();
        const table = [];
        let lastStats = null;
        let displayPosition = 1;
        for (let i = 0; i < sortedTable.length; i++) {
            const player = sortedTable[i];
            const stats = [
                player.stars,
                player.numberOfVictories,
                player.pointsBalance,
                player.pointsMake
            ];
            if (lastStats && JSON.stringify(stats) !== JSON.stringify(lastStats)) {
                displayPosition = i + 1;
            }
            player.position = displayPosition;
            lastStats = stats;
            table.push({
                position: displayPosition,
                userId: player.webSocketUserSession.getUserId,
                numOfMatch: player.numOfMatch,
                stars: player.stars,
                numberOfVictories: player.numberOfVictories,
                pointsBalance: player.pointsBalance,
                pointsMake: player.pointsMake
            });
        }
        return table;
    }
    getTableSorted() {
        const sorter = new SortTablePointMemberArray_1.SortTablePointMemberArray(this._playersOfTournament);
        return sorter.sort();
    }
    makeDraw(playerWhoTied, gameScoreboard) {
        playerWhoTied.numOfMatch = playerWhoTied.numOfMatch + 1;
        playerWhoTied.stars = playerWhoTied.stars + 1;
        playerWhoTied.pointsMake = playerWhoTied.pointsMake + gameScoreboard.getPlayerPoints(playerWhoTied);
    }
    makeVictory(playerWinner, playerLoser, gameScoreboard) {
        playerWinner.numOfMatch = playerWinner.numOfMatch + 1;
        playerWinner.stars = playerWinner.stars + 3;
        playerWinner.numberOfVictories = playerWinner.numberOfVictories + 1;
        playerWinner.pointsBalance = playerWinner.pointsBalance + (gameScoreboard.getPlayerPoints(playerWinner) - gameScoreboard.getPlayerPoints(playerLoser));
        playerWinner.pointsMake = playerWinner.pointsMake + gameScoreboard.getPlayerPoints(playerWinner);
        playerLoser.numOfMatch = playerLoser.numOfMatch + 1;
        playerLoser.pointsBalance = playerLoser.pointsBalance + (gameScoreboard.getPlayerPoints(playerLoser) - gameScoreboard.getPlayerPoints(playerWinner));
        playerLoser.pointsMake = playerLoser.pointsMake + gameScoreboard.getPlayerPoints(playerLoser);
    }
}
exports.TableOfPoints = TableOfPoints;
