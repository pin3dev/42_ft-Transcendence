import { GameScoreboard } from "../game/GameScoreboard";


export class MatchesScoreboard {

	private allScoreboardInTheRound: Map<number, GameScoreboard>;

	constructor() {
		this.allScoreboardInTheRound = new Map<number, GameScoreboard>();
	}

	public addGameScoreboard(gameScoreboard: GameScoreboard) {
		this.allScoreboardInTheRound.set(gameScoreboard.id, gameScoreboard);
	}

	public getRoundScoreboard(): any[] {

		const json = Array.from(this.allScoreboardInTheRound.values()).map(scoreboard => {
			return {
				player1Name: scoreboard.player1.webSocketUserSession.getUserName,
				player1Score: scoreboard.player1Points,
				player2Name: scoreboard.player2.webSocketUserSession.getUserName,
				player2Score: scoreboard.player2Points,
			};
		});
		return json;
	}
}