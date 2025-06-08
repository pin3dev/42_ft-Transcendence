import { WebSocketUserSession } from "../WebSocketUserSession";
import { TableOfPointRow } from "./TableOfPointRow";

export class SortTablePointMemberArray{

	private _playersOfTournament: Map<WebSocketUserSession, TableOfPointRow>;

	constructor(playersOfTournament: Map<WebSocketUserSession, TableOfPointRow>){
		this._playersOfTournament = playersOfTournament;
	}

	public sort() : TableOfPointRow[]{

		const playersOfTournament: TableOfPointRow[] = Array.from(this._playersOfTournament.values());

		const sortedTable = playersOfTournament.sort((a, b) => {
			if (b.starts !== a.starts) return b.starts - a.starts;
			if (b.numberOfVictories !== a.numberOfVictories) return b.numberOfVictories - a.numberOfVictories;
			if (b.pointsBalance !== a.pointsBalance) return b.pointsBalance - a.pointsBalance;
			if (b.pointsMake !== a.pointsMake) return b.pointsMake - a.pointsMake;
			return a.getPlayerName.localeCompare(b.getPlayerName);
		});

		return sortedTable;
	}
}