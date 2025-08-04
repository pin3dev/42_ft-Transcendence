"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationHandlerAPI = void 0;
const GameAPISingleton_1 = require("../GameAPISingleton");
const Message_1 = require("../message/Message");
const AuthenticatorStrategy_1 = require("../security/AuthenticatorStrategy");
const Sender_1 = require("../Sender");
class AuthenticationHandlerAPI {
    constructor(_userStatus, JWTpublicKey) {
        this._userStatus = _userStatus;
        this._JWTpublicKey = JWTpublicKey;
    }
    isUserAuthenticated(ws, messageFromClient) {
        const sender = new Sender_1.Sender(ws.getWebsocket);
        if (ws.getUserId === "" || messageFromClient.getType === 'AUTHENTICATION_LOGOUT') {
            if (!Message_1.Message.authenticationMessageTypeRequest.has(messageFromClient.getType)) {
                sender.sendMessage(new Message_1.Message('ERROR_USER_NOT_AUTHENTICATED'));
                return false;
            }
            const authenticator = new AuthenticatorStrategy_1.AuthenticatorStrategy(GameAPISingleton_1.GameAPISingleton.getTypeOfEnvironment(), this._JWTpublicKey);
            if (messageFromClient.getType === 'AUTHENTICATION_LOGIN') {
                const authLogin = messageFromClient;
                const isAuthenticated = authenticator.makeLogin(ws, authLogin);
                if (isAuthenticated) {
                    //console.logog('AuthenticationHandlerAPI: isUserAuthenticated');
                    this._userStatus.addUserOnline(authLogin.getValue.getUserId);
                    sender.sendMessage(new Message_1.Message('OK_USER_AUTHENTICATED'));
                }
                else {
                    sender.sendMessage(new Message_1.Message('ERROR_INVALID_CREDENTIALS'));
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
exports.AuthenticationHandlerAPI = AuthenticationHandlerAPI;
