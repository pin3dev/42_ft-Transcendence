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

		// Firstly we will always check if the user is authenticated
		if (!this.isUserAuthenticated(ws, messageFromClient)) {
			return;
		}

		// process game type messages
		if (Message.gameMessageTypeRequest.has(messageFromClient.getType)) {
			this.gameHandlerAPI.message(ws, messageFromClient);
		}

	}

	private isUserAuthenticated(ws: WebSocketUserSession, messageFromClient: Message | MessageWithValue<any>): boolean {

		const sender = new Sender(ws.getWebsocket);

		if (ws.getUserId === "" || messageFromClient.getType === 'AUTHENTICATION_LOGOUT') {

			if (!Message.authenticationMessageTypeRequest.has(messageFromClient.getType)) {
				sender.sendMessage(new Message('ERROR_USER_NOT_AUTHENTICATED'));
				return false;
			}

			const authenticator = new AuthenticatorSimple();

			if (messageFromClient.getType === 'AUTHENTICATION_LOGIN') {

				const authLogin = messageFromClient as MessageWithValue<any>;
				const isAuthenticated: boolean = authenticator.makeLogin(ws, authLogin);
				if (isAuthenticated) {
					sender.sendMessage(new Message('OK_USER_AUTHENTICATED'));
				} else {
					sender.sendMessage(new Message('ERROR_INVALID_CREDENTIALS'));
				}

			} else if (messageFromClient.getType === 'AUTHENTICATION_LOGOUT') {
				const authLogin = messageFromClient as MessageWithValue<any>;
				authenticator.makeLogout(ws);
			}
			return false;
		}
		return true;
	}
}
