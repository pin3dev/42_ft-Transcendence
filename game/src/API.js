import { Message } from './message/Message.js';
import { Sender } from './Sender.js';
import { GameHandlerAPI } from './handlers/GameHandlerAPI.js';
import { MessageParser } from './message/MessageParser.js';
import { FatalErrorMessage } from './message/FatalErrorMessage.js';
import { AuthenticationHandlerAPI } from './handlers/AuthenticationHandlerAPI.js';
import { TournamentHandlerAPI } from './handlers/TournamentHandlerAPI.js';
import { UserStatus } from './security/UserStatus.js';
export class API {
    _userStatus;
    gameHandlerAPI;
    authenticationHandlerAPI;
    tournamentHandlerAPI;
    constructor(JWTpublicKey) {
        this._userStatus = new UserStatus();
        this.gameHandlerAPI = new GameHandlerAPI();
        this.authenticationHandlerAPI = new AuthenticationHandlerAPI(this._userStatus, JWTpublicKey);
        this.tournamentHandlerAPI = new TournamentHandlerAPI(this.gameHandlerAPI);
    }
    message(ws, message) {
        const sender = new Sender(ws.getWebsocket);
        const messageFromClient = MessageParser.messageFromJSON(message);
        if (messageFromClient instanceof FatalErrorMessage) {
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
