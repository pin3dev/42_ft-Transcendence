import { GameScoreboard } from "../game/GameScoreboard";
import { SortTablePointMemberArray } from "./SortTablePointMemberArray";

import { TournamentPlayer } from "./TournamentPlayer";

export class TableOfPoints {

	private _playersOfTournament: TournamentPlayer[];

	constructor() {
		this._playersOfTournament = [];
	}

	public addPlayer(tournamentPlayer: TournamentPlayer) {
		this._playersOfTournament.push(tournamentPlayer);
	}

	public removerPlayer(tournamentPlayer: TournamentPlayer) {
		const index = this._playersOfTournament.indexOf(tournamentPlayer);
		if (index !== -1) {
			this._playersOfTournament.splice(index, 1);
		}
	}

	public addPlayerScore(gameScoreboard: GameScoreboard): void {
		if (this.areBothPlayersOffline(gameScoreboard)) return;

		if (gameScoreboard.isDraw()) {
			this.makeDraw(gameScoreboard.player1, gameScoreboard);
			this.makeDraw(gameScoreboard.player2, gameScoreboard);
		} else {
			let playerWinner: TournamentPlayer = gameScoreboard.getWinner();
			let playerLoser: TournamentPlayer = gameScoreboard.getLoser();

			this.makeVictory(playerWinner, playerLoser, gameScoreboard);
		}
	}

	public areBothPlayersOffline(gameScoreboard: GameScoreboard) {
		return (!gameScoreboard.player1.isOnline && !gameScoreboard.player2.isOnline)
	}

	public getTableJSONToclients(): any[] {

		const sortedTable = this.getTableSorted();

		const table = [];
		let lastStats: any = null;
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

	public getTableSorted(): TournamentPlayer[] {
		const sorter = new SortTablePointMemberArray(this._playersOfTournament);
		return sorter.sort();
	}

	//  ------------------- private method members  -------------------

	private makeDraw(playerWhoTied: TournamentPlayer, gameScoreboard: GameScoreboard) {
		playerWhoTied.numOfMatch = playerWhoTied.numOfMatch + 1;
		playerWhoTied.stars = playerWhoTied.stars + 1;
		playerWhoTied.pointsMake = playerWhoTied.pointsMake + gameScoreboard.getPlayerPoints(playerWhoTied)!
	}

	private makeVictory(playerWinner: TournamentPlayer, playerLoser: TournamentPlayer, gameScoreboard: GameScoreboard) {

		playerWinner.numOfMatch = playerWinner.numOfMatch + 1;
		playerWinner.stars = playerWinner.stars + 3;
		playerWinner.numberOfVictories = playerWinner.numberOfVictories + 1;
		playerWinner.pointsBalance = playerWinner.pointsBalance + (gameScoreboard.getPlayerPoints(playerWinner)! - gameScoreboard.getPlayerPoints(playerLoser)!);
		playerWinner.pointsMake = playerWinner.pointsMake + gameScoreboard.getPlayerPoints(playerWinner)!

		playerLoser.numOfMatch = playerLoser.numOfMatch + 1;
		playerLoser.pointsBalance = playerLoser.pointsBalance + (gameScoreboard.getPlayerPoints(playerLoser)! - gameScoreboard.getPlayerPoints(playerWinner)!);
		playerLoser.pointsMake = playerLoser.pointsMake + gameScoreboard.getPlayerPoints(playerLoser)!
	}
}