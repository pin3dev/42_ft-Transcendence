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

	public addPlayerScore(gameScoreboard: GameScoreboard): void {

		if (gameScoreboard.isDraw()) {
			this.makeDraw(gameScoreboard.player1!, gameScoreboard);
			this.makeDraw(gameScoreboard.player2!, gameScoreboard);
		} else {
			let playerWinner: TournamentPlayer = gameScoreboard.getWinner()!;
			let playerLoser: TournamentPlayer = gameScoreboard.getLoser()!;

			this.makeVictory(playerWinner, playerLoser, gameScoreboard);
		}
	}

	public getTable(): any[] {

		const sorter = new SortTablePointMemberArray(this._playersOfTournament);
		const sortedTable = sorter.sort();

		const table = [];
		let lastStats: any = null;
		let displayPosition = 1;

		for (let i = 0; i < sortedTable.length; i++) {
			const player = sortedTable[i];

			const stats = [
				player.starts,
				player.numberOfVictories,
				player.pointsBalance,
				player.pointsMake
			];

			if (lastStats && JSON.stringify(stats) !== JSON.stringify(lastStats)) {
				displayPosition = i + 1;
			}

			lastStats = stats;

			table.push({
				position: displayPosition,
				playerName: player.webSocketUserSession.getUserName,
				numOfMatch: player.numOfMatch,
				starts: player.starts,
				numberOfVictories: player.numberOfVictories,
				pointsBalance: player.pointsBalance,
				pointsMake: player.pointsMake
			});
		}

		return table;

	}

	//  ------------------- private method members  -------------------

	private makeDraw(playerWhoTied: TournamentPlayer, gameScoreboard: GameScoreboard) {
		playerWhoTied.numOfMatch = playerWhoTied.numOfMatch + 1;
		playerWhoTied.starts = playerWhoTied.starts + 1;
		playerWhoTied.pointsMake = playerWhoTied.pointsMake + gameScoreboard.getPlayerPoints(playerWhoTied)!
	}

	private makeVictory(playerWinner: TournamentPlayer, playerLoser: TournamentPlayer, gameScoreboard: GameScoreboard) {

		playerWinner.numOfMatch = playerWinner.numOfMatch + 1;
		playerWinner.starts = playerWinner.starts + 3;
		playerWinner.numberOfVictories = playerWinner.numberOfVictories + 3;
		playerWinner.pointsBalance = playerWinner.pointsBalance + (gameScoreboard.getPlayerPoints(playerWinner)! - gameScoreboard.getPlayerPoints(playerLoser)!);
		playerWinner.pointsMake = playerWinner.pointsMake + gameScoreboard.getPlayerPoints(playerWinner)!

		playerLoser.numOfMatch = playerLoser.numOfMatch + 1;
		playerLoser.pointsBalance = playerLoser.pointsBalance + (gameScoreboard.getPlayerPoints(playerLoser)! - gameScoreboard.getPlayerPoints(playerWinner)!);
		playerLoser.pointsMake = playerLoser.pointsMake + gameScoreboard.getPlayerPoints(playerLoser)!
	}
}