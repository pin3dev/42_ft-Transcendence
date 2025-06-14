import { TournamentPlayer } from "./TournamentPlayer";

export class SortTablePointMemberArray{

	private _playersOfTournament: TournamentPlayer[];

	constructor(playersOfTournament: TournamentPlayer[]){
		this._playersOfTournament = playersOfTournament;
	}

	public sort() : TournamentPlayer[]{

		const sortedTable = this._playersOfTournament.sort((a, b) => {
			if (b.starts !== a.starts) return b.starts - a.starts;
			if (b.numberOfVictories !== a.numberOfVictories) return b.numberOfVictories - a.numberOfVictories;
			if (b.pointsBalance !== a.pointsBalance) return b.pointsBalance - a.pointsBalance;
			if (b.pointsMake !== a.pointsMake) return b.pointsMake - a.pointsMake;
			return a.getPlayerName.localeCompare(b.getPlayerName);
		});

		return sortedTable;
	}
}