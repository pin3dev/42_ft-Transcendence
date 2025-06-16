"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortTablePointMemberArray = void 0;
class SortTablePointMemberArray {
    constructor(playersOfTournament) {
        this._playersOfTournament = playersOfTournament;
    }
    sort() {
        const sortedTable = this._playersOfTournament.sort((a, b) => {
            if (b.stars !== a.stars)
                return b.stars - a.stars;
            if (b.numberOfVictories !== a.numberOfVictories)
                return b.numberOfVictories - a.numberOfVictories;
            if (b.pointsBalance !== a.pointsBalance)
                return b.pointsBalance - a.pointsBalance;
            if (b.pointsMake !== a.pointsMake)
                return b.pointsMake - a.pointsMake;
            return a.getPlayerName.localeCompare(b.getPlayerName);
        });
        return sortedTable;
    }
}
exports.SortTablePointMemberArray = SortTablePointMemberArray;
