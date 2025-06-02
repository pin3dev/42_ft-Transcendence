import { RawData } from 'ws';
import { WebSocketUserSession } from './WebSocketUserSession';
import { Message } from './message/Message';
import { Sender } from './Sender';
import { AuthenticatorSimple } from './security/AuthenticatorSimple';
import { GameHandlerAPI } from './handlers/GameHandlerAPI';
import { MessageParser } from './message/MessageParser';
import { FatalErrorMessage } from './message/FatalErrorMessage';
import { MessageWithValue } from './message/MessageWithValue';

export class API {

	private gameHandlerAPI: GameHandlerAPI;

	constructor() {
		this.gameHandlerAPI = new GameHandlerAPI();
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

		const sender = new Sender(ws.getWebsocket);

		// if the message type is 'AUTHENTICATION_MAKE', log in
		if (Message.authenticationMessageTypeRequest.has(messageFromClient.getType)) {

			const authenticator = new AuthenticatorSimple();

			if (messageFromClient instanceof MessageWithValue) {
				const isAuthenticated: boolean = authenticator.makeLogin(ws, messageFromClient);

				if (isAuthenticated) {
					sender.sendMessage(new Message('OK_USER_AUTHENTICATED'));
				} else {
					sender.sendMessage(new Message('ERROR_INVALID_CREDENTIALS'));
				}
			}
		}

		// if the message type is different from 'AUTHENTICATION_MAKE' check if the user is authenticated
		//  before continuing
		else if (ws.getUserId === "" && !Message.authenticationMessageTypeRequest.has(messageFromClient.getType)) {
			sender.sendMessage(new Message('ERROR_USER_NOT_AUTHENTICATED'));
		}

		// process game type messages
		else if (Message.gameMessageTypeRequest.has(messageFromClient.getType)) {
			this.gameHandlerAPI.message(ws, messageFromClient);
		}
	}

}
