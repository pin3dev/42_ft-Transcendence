import { Message } from "../message/Message";
import { MessageWithValue } from "../message/MessageWithValue";
import { AuthenticatorSimple } from "../security/AuthenticatorSimple";
import { UserStatus } from "../security/UserStatus";
import { Sender } from "../Sender";
import { WebSocketUserSession } from "../WebSocketUserSession";

export class AuthenticationHandlerAPI{

	private _userStatus : UserStatus;

	constructor(_userStatus : UserStatus){
		this._userStatus = _userStatus;
	}

	public isUserAuthenticated(ws: WebSocketUserSession, messageFromClient: Message | MessageWithValue<any>): boolean {

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
					this._userStatus.addUserOnline(authLogin.getValue);
					sender.sendMessage(new Message('OK_USER_AUTHENTICATED'));
				} else {
					sender.sendMessage(new Message('ERROR_INVALID_CREDENTIALS'));
				}

			} else if (messageFromClient.getType === 'AUTHENTICATION_LOGOUT') {
				authenticator.makeLogout(ws);
			}
			return false;
		}
		return true;
	}

}