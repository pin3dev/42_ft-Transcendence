import { Game } from "../game/Game";
import { Message } from "../message/Message";
import { MessageWithValue } from "../message/MessageWithValue";
import { Sender } from "../Sender";
import { Tournament, TournamentStatus } from "../tournament/Tournament";
import { WebSocketUserSession } from "../WebSocketUserSession";
import { WebSocketUserSessionListener } from "../WebSocketUserSessionListener";

export class TournamentHandlerAPI implements WebSocketUserSessionListener {

	private static readonly MINUMUM_NUMBER_OF_PLAYERS = 2;
	private static readonly MAXIMUM_NUMBER_OF_PLAYERS = 16;

	private _tournamentPublic: Tournament | null;

	private _mapGlobal: Map<number, Game>;

	constructor(mapGlobal: Map<number, Game>) {
		this._mapGlobal = mapGlobal;
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

		const sender = new Sender(ws.getWebsocket);

		if (this._tournamentPublic === null && message.getType !== 'TOURNAMENT_CREATE') {
			sender.sendMessage(new Message('ERROR_TOURNAMENT_DOESNT_EXIST'));
		}

		if (this._tournamentPublic !== null && message.getType === 'TOURNAMENT_CREATE') {
			sender.sendMessage(new Message('ERROR_TOURNAMENT_ALREADY_EXISTS'));
		}

		//first things, handler tournament create
		if (message.getType === 'TOURNAMENT_CREATE') {

			if (this._tournamentPublic !== null){
				this._tournamentPublic?.addPlayer(ws);
			}

			const messageWithValue = message as MessageWithValue<number>;

			if (messageWithValue.getValue < TournamentHandlerAPI.MINUMUM_NUMBER_OF_PLAYERS) {
				sender.sendMessage(new Message('ERROR_TOURNAMENT_CREATING_FEW_PLAYERS'));
			} else if (messageWithValue.getValue > TournamentHandlerAPI.MAXIMUM_NUMBER_OF_PLAYERS) {
				sender.sendMessage(new Message('ERROR_TOURNAMENT_CREATING_MANY_PLAYERS'));
			} else if ((messageWithValue.getValue % 2) !== 0) {
				sender.sendMessage(new Message('ERROR_TOURNAMENT_CREATING_ODD_PLAYERS'));
			}

			this._tournamentPublic = new Tournament(messageWithValue.getValue, this._mapGlobal);
			sender.sendMessage(new Message('TOURNAMENT_CREATED'));
			return;
		} else if (message.getType === 'TOURNAMENT_TO_PARTICIPATE') {
			this._tournamentPublic?.addPlayer(ws);
		}
	}


	close(ws: WebSocketUserSession): void {

		if (this._tournamentPublic === null) return;

		this._tournamentPublic.removePlayer(ws);
	}
}