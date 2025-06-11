import { TournamentPlayer } from "./TournamentPlayer";

export class MakeRounds {

	private fixPlayers: TournamentPlayer[];

	constructor(tournamentPlayer: TournamentPlayer[]) {
		this.fixPlayers = [...tournamentPlayer];
	}

	public getARound(): [TournamentPlayer, TournamentPlayer][] {

		const middle = this.fixPlayers.length - 1;

		const round: [TournamentPlayer, TournamentPlayer][] = [];

		for (let i = 0; i < middle; i++) {
			const player1 = this.fixPlayers[i];
			const player2 = this.fixPlayers[this.fixPlayers.length - 1 - i];
			round.push([player1, player2]);
		}

		// Rotates players (except the first one)
		const rotate = this.fixPlayers.splice(1);
		rotate.unshift(rotate.pop()!); // turn right
		this.fixPlayers.splice(1, 0, ...rotate);

		return round;
	}

}

