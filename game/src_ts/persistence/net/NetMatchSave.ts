import { Game } from "../../game/Game";
import { MatchSave } from "../MatchSave";

const redisModules = require("../../../pckg/redis/modules.js");

export class NetMatchSave implements MatchSave {
	save(match: Game): void {

		redisModules.publishEvent(redisModules.EventTypes.MATCH_FINISHED, {
			id: String(match.getId),
			tournamentId: match.getTournamentId(),
			player1Id: match.getPlayer1Id(),
			player2Id: match.getPlayer2Id(),
			winnerId: match.getWinnerId(),
			score: match.getScore(),
			startedAt: match.getStartedAt(),
			endedAt: match.getEndedAt()
		}, "game-server");
	}
}