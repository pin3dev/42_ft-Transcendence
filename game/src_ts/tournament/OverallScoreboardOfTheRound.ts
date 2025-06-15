import { GameScoreboard } from "../game/GameScoreboard";

export class OverallScoreboardOfTheRound {

	private allScoreboardInTheRound: Map<number, GameScoreboard>;

	constructor() {
		this.allScoreboardInTheRound = new Map<number, GameScoreboard>();
	}

	public addGameScoreboard(gameScoreboard: GameScoreboard) {
		this.allScoreboardInTheRound.set(gameScoreboard.id, gameScoreboard);
	}

	public getRoundScoreboardJSONToClients(): any[] {

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