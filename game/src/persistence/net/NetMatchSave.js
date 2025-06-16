"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetMatchSave = void 0;
const redisModules = require("../../../pckg/redis/modules.js");
class NetMatchSave {
    save(match) {
        redisModules.publishEvent(redisModules.EventTypes.MATCH_FINISHED, {
            id: String(match.getId),
            tournamentId: match.getTournamentId(),
            player1Id: match.getPlayer1Id(),
            player2Id: match.getPlayer2Id(),
            winnerId: match.getWinnerId(),
            score: match.getScore(),
            startedAt: match.getStartedAt(),
            endedAt: match.getEndedAt(),
            whoWin: match.getWhoWin()
        }, "game-server");
    }
}
exports.NetMatchSave = NetMatchSave;
