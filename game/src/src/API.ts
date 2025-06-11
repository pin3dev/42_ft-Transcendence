import { RawData } from 'ws';
import { WebSocketUserSession } from './WebSocketUserSession';
import { Message } from './message/Message';
import { Sender } from './Sender';
import { GameHandlerAPI } from './handlers/GameHandlerAPI';
import { MessageParser } from './message/MessageParser';
import { FatalErrorMessage } from './message/FatalErrorMessage';
import { MessageWithValue } from './message/MessageWithValue';
import { AuthenticationHandlerAPI } from './handlers/AuthenticationHandlerAPI';

export class API {

	private gameHandlerAPI: GameHandlerAPI;
	private authenticationHandlerAPI: AuthenticationHandlerAPI;

	constructor() {
		this.gameHandlerAPI = new GameHandlerAPI();
		this.authenticationHandlerAPI = new AuthenticationHandlerAPI();
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
	}

	private handlerMessageFromClient(ws: WebSocketUserSession, messageFromClient: Message | MessageWithValue<any>): void {

		// Firstly we will always check if the user is authenticated
		if (!this.authenticationHandlerAPI.isUserAuthenticated(ws, messageFromClient)) {
			return;
		}

		// process game type messages, if tour
		if (Message.gameMessageTypeRequest.has(messageFromClient.getType) && ws.getTournamentId == 0) {
			this.gameHandlerAPI.message(ws, messageFromClient);
		}

		//se a mensagem for to tipo game mas o torneio id for diferente de 0, logo, o game eh de um torneio, usar o handler de torneios

	}

}
