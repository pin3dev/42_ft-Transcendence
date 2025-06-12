import { Message } from "../message/Message";
import { Tournament, TournamentStatus } from "../tournament/Tournament";
import { WebSocketUserSession } from "../WebSocketUserSession";
import { WebSocketUserSessionListener } from "../WebSocketUserSessionListener";

export class TournamentHandlerAPI implements WebSocketUserSessionListener {

	private _tournamentPublic: Tournament | null;

	constructor() {
		this._tournamentPublic = null;
		this.clearPublicTournamentFinished();
	}

	// This setInterval will run so that every time a tournament ends it will clear the only global public tournament and allow a new one to be created.
	private clearPublicTournamentFinished(): void {
		setInterval(() => {
			if (this._tournamentPublic !== null && this._tournamentPublic.getStatus() === TournamentStatus.FINISHED) {
				this._tournamentPublic = null;
			}
		}, 100);
	}

	message(ws: WebSocketUserSession, message: Message): void {
		throw new Error("Method not implemented.");
	}
	close(ws: WebSocketUserSession): void {
		throw new Error("Method not implemented.");
	}
}