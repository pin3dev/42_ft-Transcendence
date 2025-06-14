import { Game } from "../../game/Game";
import { MatchSave } from "../MatchSave";

export class NetMatchSave implements MatchSave{
	save(match: Game): void {

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