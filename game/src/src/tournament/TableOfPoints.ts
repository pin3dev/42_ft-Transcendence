import { GameScoreboard } from "../game/GameScoreboard";
import { WebSocketUserSession } from "../WebSocketUserSession";
import { SortTablePointMemberArray } from "./SortTablePointMemberArray";
import { TableOfPointRow } from "./TableOfPointRow";

export class TableOfPoints {

	private _playersOfTournament: Map<WebSocketUserSession, TableOfPointRow>;

	constructor() {
		this._playersOfTournament = new Map<WebSocketUserSession, TableOfPointRow>;
	}

	public addPlayer(webSocketUserSession: WebSocketUserSession) {
		this._playersOfTournament.set(webSocketUserSession, new TableOfPointRow(webSocketUserSession));
	}

	public addPlayerScore(gameScoreboard: GameScoreboard): void {

		if (gameScoreboard.isDraw()) {
			this.makeDraw(this._playersOfTournament.get(gameScoreboard.player1)!, gameScoreboard);
			this.makeDraw(this._playersOfTournament.get(gameScoreboard.player2)!, gameScoreboard);
		} else {
			let playerWinner: TableOfPointRow = this._playersOfTournament.get(gameScoreboard.getWinner()!)!;
			let playerLoser: TableOfPointRow = this._playersOfTournament.get(gameScoreboard.getLoser()!)!;

			this.makeVictory(playerWinner, playerLoser, gameScoreboard);
		}
	}

	public addTableOfPointRow(webSocketUserSession: WebSocketUserSession, tableOfPointRow : TableOfPointRow){
		this._playersOfTournament.set(webSocketUserSession, tableOfPointRow);
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

	private makeDraw(playerWhoTied: TableOfPointRow, gameScoreboard: GameScoreboard) {
		playerWhoTied.numOfMatch = playerWhoTied.numOfMatch + 1;
		playerWhoTied.starts = playerWhoTied.starts + 1;
		playerWhoTied.pointsMake = playerWhoTied.pointsMake + gameScoreboard.getPlayerPoints(playerWhoTied.webSocketUserSession)!
	}

	private makeVictory(playerWinner: TableOfPointRow, playerLoser: TableOfPointRow, gameScoreboard: GameScoreboard) {

		playerWinner.numOfMatch = playerWinner.numOfMatch + 1;
		playerWinner.starts = playerWinner.starts + 3;
		playerWinner.numberOfVictories = playerWinner.numberOfVictories + 3;
		playerWinner.pointsBalance = playerWinner.pointsBalance + (gameScoreboard.getPlayerPoints(playerWinner.webSocketUserSession)! - gameScoreboard.getPlayerPoints(playerLoser.webSocketUserSession)!);
		playerWinner.pointsMake = playerWinner.pointsMake + gameScoreboard.getPlayerPoints(playerWinner.webSocketUserSession)!

		playerLoser.numOfMatch = playerLoser.numOfMatch + 1;
		playerLoser.pointsBalance = playerLoser.pointsBalance + (gameScoreboard.getPlayerPoints(playerLoser.webSocketUserSession)! - gameScoreboard.getPlayerPoints(playerWinner.webSocketUserSession)!);
		playerLoser.pointsMake = playerLoser.pointsMake + gameScoreboard.getPlayerPoints(playerLoser.webSocketUserSession)!
	}
}