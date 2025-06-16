"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API = void 0;
const Message_1 = require("./message/Message");
const Sender_1 = require("./Sender");
const GameHandlerAPI_1 = require("./handlers/GameHandlerAPI");
const MessageParser_1 = require("./message/MessageParser");
const FatalErrorMessage_1 = require("./message/FatalErrorMessage");
const AuthenticationHandlerAPI_1 = require("./handlers/AuthenticationHandlerAPI");
const TournamentHandlerAPI_1 = require("./handlers/TournamentHandlerAPI");
const UserStatus_1 = require("./security/UserStatus");
class API {
    constructor(JWTpublicKey) {
        this._userStatus = new UserStatus_1.UserStatus();
        this.gameHandlerAPI = new GameHandlerAPI_1.GameHandlerAPI();
        this.authenticationHandlerAPI = new AuthenticationHandlerAPI_1.AuthenticationHandlerAPI(this._userStatus, JWTpublicKey);
        this.tournamentHandlerAPI = new TournamentHandlerAPI_1.TournamentHandlerAPI(this.gameHandlerAPI);
    }
    message(ws, message) {
        const sender = new Sender_1.Sender(ws.getWebsocket);
        const messageFromClient = MessageParser_1.MessageParser.messageFromJSON(message);
        if (messageFromClient instanceof FatalErrorMessage_1.FatalErrorMessage) {
            sender.sendMessage(messageFromClient);
            return;
        }
        this.handlerMessageFromClient(ws, messageFromClient);
    }
    close(ws) {
        this.gameHandlerAPI.close(ws);
        this.tournamentHandlerAPI.close(ws);
        this._userStatus.addUserOffline(ws.getUserId);
    }
    handlerMessageFromClient(ws, messageFromClient) {
        if (!this.authenticationHandlerAPI.isUserAuthenticated(ws, messageFromClient)) {
            return;
        }
        if (Message_1.Message.gameMessageTypeRequest.has(messageFromClient.getType)) {
            this.gameHandlerAPI.message(ws, messageFromClient);
        }
        if (Message_1.Message.tournamentMessageTypeRequest.has(messageFromClient.getType)) {
            this.tournamentHandlerAPI.message(ws, messageFromClient);
        }
    }
}
exports.API = API;
