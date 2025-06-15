import { Message } from "../message/Message.js";
import { Sender } from "../Sender.js";
import { Tournament, TournamentStatus } from "../tournament/Tournament.js";
export class TournamentHandlerAPI {
    static MINUMUM_NUMBER_OF_PLAYERS = 2;
    static MAXIMUM_NUMBER_OF_PLAYERS = 16;
    _tournamentPublic;
    _gameHandlerAPI;
    constructor(gameHandlerAPI) {
        this._gameHandlerAPI = gameHandlerAPI;
        this._tournamentPublic = null;
        this.clearPublicTournamentFinished();
    }
    // This setInterval will run so that every time a tournament ends it will clear the only global public tournament and allow a new one to be created.
    clearPublicTournamentFinished() {
        setInterval(() => {
            if (this._tournamentPublic !== null && this._tournamentPublic.getStatus() === TournamentStatus.FINISHED) {
                this._tournamentPublic = null;
            }
        }, 100);
    }
    message(ws, message) {
        const sender = new Sender(ws.getWebsocket);
        if (this._tournamentPublic === null && message.getType !== 'TOURNAMENT_CREATE') {
            sender.sendMessage(new Message('ERROR_TOURNAMENT_DOESNT_EXIST'));
            return;
        }
        if (this._tournamentPublic !== null && message.getType === 'TOURNAMENT_CREATE') {
            sender.sendMessage(new Message('ERROR_TOURNAMENT_ALREADY_EXISTS'));
            return;
        }
        //first things, handler tournament create
        if (message.getType === 'TOURNAMENT_CREATE') {
            const messageWithValue = message;
            if (messageWithValue.getValue < TournamentHandlerAPI.MINUMUM_NUMBER_OF_PLAYERS) {
                sender.sendMessage(new Message('ERROR_TOURNAMENT_CREATING_FEW_PLAYERS'));
                return;
            }
            else if (messageWithValue.getValue > TournamentHandlerAPI.MAXIMUM_NUMBER_OF_PLAYERS) {
                sender.sendMessage(new Message('ERROR_TOURNAMENT_CREATING_MANY_PLAYERS'));
                return;
            }
            else if ((messageWithValue.getValue % 2) !== 0) {
                sender.sendMessage(new Message('ERROR_TOURNAMENT_CREATING_ODD_PLAYERS'));
                return;
            }
            this._tournamentPublic = new Tournament(messageWithValue.getValue, this._gameHandlerAPI);
            sender.sendMessage(new Message('TOURNAMENT_CREATED'));
            this._tournamentPublic?.addPlayer(ws);
        }
        else if (message.getType === 'TOURNAMENT_TO_PARTICIPATE') {
            //if 'true' the tournament is full! So, lets start it!
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
