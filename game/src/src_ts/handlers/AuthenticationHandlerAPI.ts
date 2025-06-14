import { GameAPISingleton } from "../GameAPISingleton";
import { Message } from "../message/Message";
import { MessageWithValue } from "../message/MessageWithValue";
import { AuthenticatorJWT } from "../security/AuthenticatorJWT";
import { AuthenticatorStrategy } from "../security/AuthenticatorStrategy";
import { UserStatus } from "../security/UserStatus";
import { Sender } from "../Sender";
import { WebSocketUserSession } from "../WebSocketUserSession";

export class AuthenticationHandlerAPI{

	private _userStatus : UserStatus;
	private _JWTpublicKey : string;

	constructor(_userStatus : UserStatus, JWTpublicKey : string){
		this._userStatus = _userStatus;
		this._JWTpublicKey = JWTpublicKey;
	}

	public isUserAuthenticated(ws: WebSocketUserSession, messageFromClient: Message | MessageWithValue<any>): boolean {

		const sender = new Sender(ws.getWebsocket);

		if (ws.getUserId === "" || messageFromClient.getType === 'AUTHENTICATION_LOGOUT') {

			if (!Message.authenticationMessageTypeRequest.has(messageFromClient.getType)) {
				sender.sendMessage(new Message('ERROR_USER_NOT_AUTHENTICATED'));
				return false;
			}

			const authenticator = new AuthenticatorStrategy(GameAPISingleton.getTypeOfEnvironment(), this._JWTpublicKey);           //JWT(this._JWTpublicKey);

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