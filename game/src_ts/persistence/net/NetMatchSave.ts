import { Game } from "../../game/Game";
import { MatchSave } from "../MatchSave";
//import { publishEvent, EventTypes } from "../../../../pckg/redis/modules.js";

const redisModules = require("../../../pckg/redis/modules.js");

export class NetMatchSave implements MatchSave {
	save(match: Game): void {

		redisModules.publishEvent(redisModules.EventTypes.MATCH_FINISHED, {
			data: {
				id: match.getId,
				tournamentId: 1,
				player1Id: match.getPlayer1Id(),
				player2Id: match.getPlayer2Id(),
				winnerId: match.getWinnerId(),
				score: match.getScore(),
				startedAt: match.getStartedAt(),
				endedAt: match.getEndedAt()
			}
		});

		/*
		 this.id = id;
		 this.tournamentId = tournamentId;
		 this.player1Id = player1Id;
		 this.player2Id = player2Id;
		 this.winnerId = winnerId;
		 this.score = score;
		 this.startedAt = startedAt;
		 this.endedAt = endedAt;
		 */
	}
}


/*
const { publishEvent, EventTypes } = require("../../pckg/redis/modules.js"); AQUI ESTA O setCache e o publishEvent

await publishEvent(EventTypes.MATCH_FINISHED, {
	user_id: user.id,
	email: user.email //dados tratados no matches
}, "auth-service");


id, tournamentId, player1Id, player2Id, winnerId, score, startedAt, endedAt

#online off line....

await setCache(`user_status:${user_id}`, true, null);
*/