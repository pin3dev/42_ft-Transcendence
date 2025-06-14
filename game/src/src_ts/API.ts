import { RawData } from 'ws';
import { WebSocketUserSession } from './WebSocketUserSession';
import { Message } from './message/Message';
import { Sender } from './Sender';
import { GameHandlerAPI } from './handlers/GameHandlerAPI';
import { MessageParser } from './message/MessageParser';
import { FatalErrorMessage } from './message/FatalErrorMessage';
import { MessageWithValue } from './message/MessageWithValue';
import { AuthenticationHandlerAPI } from './handlers/AuthenticationHandlerAPI';
import { TournamentHandlerAPI } from './handlers/TournamentHandlerAPI';
import { UserStatus } from './security/UserStatus';

export class API {

	private _userStatus : UserStatus;

	private gameHandlerAPI: GameHandlerAPI;
	private authenticationHandlerAPI: AuthenticationHandlerAPI;
	private tournamentHandlerAPI : TournamentHandlerAPI;

	constructor(JWTpublicKey : string) {
		this._userStatus = new UserStatus();

		this.gameHandlerAPI = new GameHandlerAPI();
		this.authenticationHandlerAPI = new AuthenticationHandlerAPI(this._userStatus, JWTpublicKey);
		this.tournamentHandlerAPI = new TournamentHandlerAPI(this.gameHandlerAPI.getMapgamesGlobal());
	}

	public message(ws: WebSocketUserSession, message: RawData): void {

		const sender = new Sender(ws.getWebsocket);

		const messageFromClient = MessageParser.messageFromJSON(message);

		if (messageFromClient instanceof FatalErrorMessage) {
			sender.sendMessage(messageFromClient);
			return;
		}

		this.handlerMessageFromClient(ws, messageFromClient);
	}

	public close(ws: WebSocketUserSession) {
		this.gameHandlerAPI.close(ws);
		this.tournamentHandlerAPI.close(ws);
		this._userStatus.addUserOffline(ws.getUserId);
	}

	private handlerMessageFromClient(ws: WebSocketUserSession, messageFromClient: Message | MessageWithValue<any>): void {

		// Firstly we will always check if the user is authenticated
		if (!this.authenticationHandlerAPI.isUserAuthenticated(ws, messageFromClient)) {
			return;
		}

		// process game type messages, if tour
		if (Message.gameMessageTypeRequest.has(messageFromClient.getType)) {
			this.gameHandlerAPI.message(ws, messageFromClient);
		}

		if (Message.tournamentMessageTypeRequest.has(messageFromClient.getType)) {
			this.tournamentHandlerAPI.message(ws, messageFromClient);
		}


		//se a mensagem for to tipo game mas o torneio id for diferente de 0, logo, o game eh de um torneio, usar o handler de torneios

	}

}
