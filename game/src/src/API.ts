import { RawData } from 'ws';
import { WebSocketUserSession } from './WebSocketUserSession';
import { Message } from './message/Message';
import { Sender } from './Sender';
import { AuthenticatorSimple } from './security/AuthenticatorSimple';
import { GameHandlerAPI } from './handlers/GameHandlerAPI';

export class API {

	private gameHandlerAPI: GameHandlerAPI;

	constructor() {
		this.gameHandlerAPI = new GameHandlerAPI();
	}

	public message(ws: WebSocketUserSession, message: RawData): void {

		const sender = new Sender(ws.getWebsocket);

		const messageFromClient = Message.fromJSON(message);

		if (messageFromClient.getType === 'ERROR_INVALID_JSON_SYNTAX' ||
			messageFromClient.getType === 'ERROR_INVALID_TYPE_MESSAGE') {
			sender.sendMessage(messageFromClient);
			return;
		}

		this.handlerMessageFromClient(ws, messageFromClient);

	}

	public close(ws: WebSocketUserSession) {
		this.gameHandlerAPI.close(ws);
	}

	private handlerMessageFromClient(ws: WebSocketUserSession, messageFromClient: Message<any>): void {

		const sender = new Sender(ws.getWebsocket);

		// if the message type is 'AUTHENTICATION_MAKE', log in
		if (Message.authenticationMessageTypeRequest.has(messageFromClient.getType)) {
			const authenticator = new AuthenticatorSimple();

			const isAuthenticated: boolean = authenticator.makeLogin(ws, messageFromClient);

			if (isAuthenticated) {
				sender.sendMessage(new Message<null>('OK_USER_AUTHENTICATED', null));
			} else {
				sender.sendMessage(new Message<null>('ERROR_INVALID_CREDENTIALS', null));
			}
		}

		// if the message type is different from 'AUTHENTICATION_MAKE' check if the user is authenticated
		//  before continuing
		else if (ws.getUserId === "" && !Message.authenticationMessageTypeRequest.has(messageFromClient.getType)) {
			sender.sendMessage(new Message<null>('ERROR_USER_NOT_AUTHENTICATED', null));
		}

		// process game type messages
		else if (Message.gameMessageTypeRequest.has(messageFromClient.getType)) {
			this.gameHandlerAPI.message(ws, messageFromClient);
		}
	}

}
