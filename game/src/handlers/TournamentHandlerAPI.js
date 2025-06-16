"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentHandlerAPI = void 0;
const Message_1 = require("../message/Message");
const Sender_1 = require("../Sender");
const Tournament_1 = require("../tournament/Tournament");
class TournamentHandlerAPI {
    constructor(gameHandlerAPI) {
        this._gameHandlerAPI = gameHandlerAPI;
        this._tournamentPublic = null;
        this.clearPublicTournamentFinished();
    }
    clearPublicTournamentFinished() {
        setInterval(() => {
            if (this._tournamentPublic !== null && this._tournamentPublic.getStatus() === Tournament_1.TournamentStatus.FINISHED) {
                this._tournamentPublic = null;
            }
        }, 100);
    }
    message(ws, message) {
        const sender = new Sender_1.Sender(ws.getWebsocket);
        if (this._tournamentPublic === null && message.getType !== 'TOURNAMENT_CREATE') {
            sender.sendMessage(new Message_1.Message('ERROR_TOURNAMENT_DOESNT_EXIST'));
            return;
        }
        if (this._tournamentPublic !== null && message.getType === 'TOURNAMENT_CREATE') {
            sender.sendMessage(new Message_1.Message('ERROR_TOURNAMENT_ALREADY_EXISTS'));
            return;
        }
        if (message.getType === 'TOURNAMENT_CREATE') {
            const messageWithValue = message;
            if (messageWithValue.getValue < TournamentHandlerAPI.MINUMUM_NUMBER_OF_PLAYERS) {
                sender.sendMessage(new Message_1.Message('ERROR_TOURNAMENT_CREATING_FEW_PLAYERS'));
                return;
            }
            else if (messageWithValue.getValue > TournamentHandlerAPI.MAXIMUM_NUMBER_OF_PLAYERS) {
                sender.sendMessage(new Message_1.Message('ERROR_TOURNAMENT_CREATING_MANY_PLAYERS'));
                return;
            }
            else if ((messageWithValue.getValue % 2) !== 0) {
                sender.sendMessage(new Message_1.Message('ERROR_TOURNAMENT_CREATING_ODD_PLAYERS'));
                return;
            }
            this._tournamentPublic = new Tournament_1.Tournament(messageWithValue.getValue, this._gameHandlerAPI);
            sender.sendMessage(new Message_1.Message('TOURNAMENT_CREATED'));
            this._tournamentPublic?.addPlayer(ws);
        }
        else if (message.getType === 'TOURNAMENT_TO_PARTICIPATE') {
            if (this._tournamentPublic?.addPlayer(ws)) {
                this._tournamentPublic.start();
            }
        }
    }
    close(ws) {
        if (this._tournamentPublic === null)
            return;
        this._tournamentPublic.removePlayer(ws);
    }
}
exports.TournamentHandlerAPI = TournamentHandlerAPI;
TournamentHandlerAPI.MINUMUM_NUMBER_OF_PLAYERS = 2;
TournamentHandlerAPI.MAXIMUM_NUMBER_OF_PLAYERS = 16;
