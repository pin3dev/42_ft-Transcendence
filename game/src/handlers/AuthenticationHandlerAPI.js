import { GameAPISingleton } from "../GameAPISingleton.js";
import { Message } from "../message/Message.js";
import { AuthenticatorStrategy } from "../security/AuthenticatorStrategy.js";
import { Sender } from "../Sender.js";
export class AuthenticationHandlerAPI {
    _userStatus;
    _JWTpublicKey;
    constructor(_userStatus, JWTpublicKey) {
        this._userStatus = _userStatus;
        this._JWTpublicKey = JWTpublicKey;
    }
    isUserAuthenticated(ws, messageFromClient) {
        const sender = new Sender(ws.getWebsocket);
        if (ws.getUserId === "" || messageFromClient.getType === 'AUTHENTICATION_LOGOUT') {
            if (!Message.authenticationMessageTypeRequest.has(messageFromClient.getType)) {
                sender.sendMessage(new Message('ERROR_USER_NOT_AUTHENTICATED'));
                return false;
            }
            const authenticator = new AuthenticatorStrategy(GameAPISingleton.getTypeOfEnvironment(), this._JWTpublicKey);
            if (messageFromClient.getType === 'AUTHENTICATION_LOGIN') {
                const authLogin = messageFromClient;
                const isAuthenticated = authenticator.makeLogin(ws, authLogin);
                if (isAuthenticated) {
                    this._userStatus.addUserOnline(authLogin.getValue);
                    sender.sendMessage(new Message('OK_USER_AUTHENTICATED'));
                }
                else {
                    sender.sendMessage(new Message('ERROR_INVALID_CREDENTIALS'));
                }
            }
            else if (messageFromClient.getType === 'AUTHENTICATION_LOGOUT') {
                authenticator.makeLogout(ws);
            }
            return false;
        }
        return true;
    }
}
