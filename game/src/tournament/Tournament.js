"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tournament = exports.RoundStatus = exports.TournamentStatus = void 0;
const GameScoreboard_1 = require("../game/GameScoreboard");
const Message_1 = require("../message/Message");
const MessageWithValue_1 = require("../message/MessageWithValue");
const Sender_1 = require("../Sender");
const GameTournament_1 = require("./GameTournament");
const MakeRounds_1 = require("./MakeRounds");
const OverallScoreboardOfTheRound_1 = require("./OverallScoreboardOfTheRound");
const TableOfPoints_1 = require("./TableOfPoints");
const TournamentPlayer_1 = require("./TournamentPlayer");
var TournamentStatus;
(function (TournamentStatus) {
    TournamentStatus[TournamentStatus["WAITING_PLAYERS"] = 0] = "WAITING_PLAYERS";
    TournamentStatus[TournamentStatus["READY"] = 1] = "READY";
    TournamentStatus[TournamentStatus["RUNNING"] = 2] = "RUNNING";
    TournamentStatus[TournamentStatus["FINISHED"] = 3] = "FINISHED";
})(TournamentStatus || (exports.TournamentStatus = TournamentStatus = {}));
var RoundStatus;
(function (RoundStatus) {
    RoundStatus[RoundStatus["COUNT_DOWN"] = 0] = "COUNT_DOWN";
    RoundStatus[RoundStatus["WAITING_COUNTDOWN"] = 1] = "WAITING_COUNTDOWN";
    RoundStatus[RoundStatus["CREATE_ROUND"] = 2] = "CREATE_ROUND";
    RoundStatus[RoundStatus["ROUND_GOING_ON"] = 3] = "ROUND_GOING_ON";
    RoundStatus[RoundStatus["ROUNDS_ENDED"] = 4] = "ROUNDS_ENDED";
})(RoundStatus || (exports.RoundStatus = RoundStatus = {}));
class Tournament {
    constructor(numberOfPlayer, gameHandlerAPI) {
        this._id = 1;
        this._numberOfPlayer = 0;
        this._overallScoreboardOfTheRound = new OverallScoreboardOfTheRound_1.OverallScoreboardOfTheRound();
        this._numberOfPlayer = numberOfPlayer;
        this._gameHandlerAPI = gameHandlerAPI;
        this._idsOfGamesRound = [];
        this._tournamentPlayers = new Map();
        this._tableOfPoints = new TableOfPoints_1.TableOfPoints();
        this._tournamentStatus = TournamentStatus.WAITING_PLAYERS;
        this._roundCount = 0;
        this._roundCountMaxRounds = numberOfPlayer - 1;
        this._numberOfGamesCompletedInTheRound = 0;
        this._numberOfGamesCompletedInTheRoundMaxPossible = numberOfPlayer / 2;
        this._roundStatus = RoundStatus.COUNT_DOWN;
        this._countDown = 3;
        this._makeRound = new MakeRounds_1.MakeRounds(null);
    }
    addPlayer(webSocketUserSession) {
        const sender = new Sender_1.Sender(webSocketUserSession.getWebsocket);
        if (this._tournamentStatus === TournamentStatus.FINISHED) {
            sender.sendMessage(new Message_1.Message('ERROR_TOURNAMENT_FINISHED'));
            return false;
        }
        if (this._tournamentStatus === TournamentStatus.RUNNING) {
            sender.sendMessage(new Message_1.Message('ERROR_TOURNAMENT_IN_PROGRESS'));
            return false;
        }
        if (this._tournamentPlayers.size === this._numberOfPlayer) {
            sender.sendMessage(new Message_1.Message('ERROR_TOURNARMENT_FULL'));
            return false;
        }
        if (webSocketUserSession.getTournamentId === this._id) {
            sender.sendMessage(new Message_1.Message('ERROR_TOURNAMENT_ALREADY_PARTICIPATING'));
            return false;
        }
        for (let webSocketUserSessionAlreadyInTheTournament of this._tournamentPlayers.keys()) {
            if (webSocketUserSession.getUserId === webSocketUserSessionAlreadyInTheTournament.getUserId) {
                sender.sendMessage(new Message_1.Message('ERROR_TOURNAMENT_ALREADY_PARTICIPATING'));
                return false;
            }
        }
        webSocketUserSession.setTournamentId = this._id;
        let tournamentPlayer = new TournamentPlayer_1.TournamentPlayer(true, webSocketUserSession);
        this._tournamentPlayers.set(webSocketUserSession, tournamentPlayer);
        this._tableOfPoints.addPlayer(tournamentPlayer);
        sender.sendMessage(new Message_1.Message('TOURNAMENT_WAITING_PLAYER'));
        this.sendMessageTableOfPoints();
        if (this._tournamentPlayers.size === this._numberOfPlayer) {
            this._tournamentStatus = TournamentStatus.READY;
        }
        return (this._tournamentPlayers.size === this._numberOfPlayer);
    }
    removePlayer(webSocketUserSession) {
        webSocketUserSession.setTournamentId = 0;
        if (this._tournamentStatus === TournamentStatus.FINISHED) {
            return;
        }
        if (this._tournamentStatus === TournamentStatus.WAITING_PLAYERS) {
            let tournamentPlayer = this._tournamentPlayers.get(webSocketUserSession);
            if (tournamentPlayer !== undefined) {
                this._tableOfPoints.removerPlayer(tournamentPlayer);
            }
            this._tournamentPlayers.delete(webSocketUserSession);
            if (this._tournamentPlayers.size === 0) {
                this._tournamentStatus = TournamentStatus.FINISHED;
            }
            return;
        }
        let tournamentPlayer = this._tournamentPlayers.get(webSocketUserSession);
        if (tournamentPlayer !== undefined) {
            tournamentPlayer.isOnline = false;
        }
    }
    start() {
        if (this._tournamentStatus !== TournamentStatus.READY)
            return;
        this._makeRound = new MakeRounds_1.MakeRounds(Array.from(this._tournamentPlayers.values()));
        this._roundStatus = RoundStatus.COUNT_DOWN;
        this._tournamentStatus = TournamentStatus.RUNNING;
        this.tournamentLoop();
    }
    getStatus() {
        return this._tournamentStatus;
    }
    tournamentLoop() {
        this.mainInterval = setInterval(() => {
            switch (this._roundStatus) {
                case RoundStatus.COUNT_DOWN:
                    this.sendCountDown();
                    this._roundStatus = RoundStatus.WAITING_COUNTDOWN;
                    break;
                case RoundStatus.CREATE_ROUND:
                    this._roundStatus = RoundStatus.ROUND_GOING_ON;
                    this.doRound();
                    break;
                case RoundStatus.ROUND_GOING_ON:
                    {
                        if (this._roundCount === this._roundCountMaxRounds) {
                            this._roundStatus = RoundStatus.ROUNDS_ENDED;
                        }
                        else if (this._numberOfGamesCompletedInTheRound === this._numberOfGamesCompletedInTheRoundMaxPossible) {
                            this._roundStatus = RoundStatus.COUNT_DOWN;
                            this._roundCount++;
                        }
                        break;
                    }
                case RoundStatus.ROUNDS_ENDED:
                    this.tournamentIsOver();
                    this.stopTournamentLoop();
            }
        }, 10);
    }
    stopCountDownRoutine() {
        if (this.countDownInterval) {
            clearInterval(this.countDownInterval);
            this.countDownInterval = undefined;
        }
    }
    stopTournamentLoop() {
        if (this.mainInterval) {
            clearInterval(this.mainInterval);
            this.mainInterval = undefined;
        }
        this._tournamentStatus = TournamentStatus.FINISHED;
    }
    sendCountDown() {
        this._countDown = 3;
        this.countDownInterval = setInterval(() => {
            this.broadcast('TOURNAMENT_COUNT_DOWN', this._countDown);
            this._countDown--;
            if (this._countDown < 0) {
                this.stopCountDownRoutine();
                this._roundStatus = RoundStatus.CREATE_ROUND;
            }
        }, 1000);
    }
    tournamentIsOver() {
        const finalTableOfPointsSorted = this._tableOfPoints.getTableSorted();
        for (let playerTornament of finalTableOfPointsSorted) {
            this.sendMessagePlayerFinalPosition(playerTornament);
            playerTornament.webSocketUserSession.setGameId = 0;
            playerTornament.webSocketUserSession.setTournamentId = 0;
        }
    }
    doRound() {
        this._numberOfGamesCompletedInTheRound = 0;
        for (const idOfGamesInTheRound of this._idsOfGamesRound) {
            this._gameHandlerAPI.removeGameToGlobalGameMap(idOfGamesInTheRound);
        }
        this._idsOfGamesRound = [];
        let roundPairs = this._makeRound.getARound();
        this._overallScoreboardOfTheRound = new OverallScoreboardOfTheRound_1.OverallScoreboardOfTheRound();
        let arrayOfGamescoreboardToThisRound = [];
        for (const playersOfGame of roundPairs) {
            const gameScoreboard = new GameScoreboard_1.GameScoreboard(playersOfGame[0], playersOfGame[1]);
            arrayOfGamescoreboardToThisRound.push(gameScoreboard);
            this._overallScoreboardOfTheRound.addGameScoreboard(gameScoreboard);
        }
        this.sendMessageOverallScoreboard();
        this.sendMessageTableOfPoints();
        let isTheTournamentWithoutPlayers = true;
        for (const gameboard of arrayOfGamescoreboardToThisRound) {
            if (!gameboard.player1.isOnline && !gameboard.player2.isOnline) {
                this.playEnded(gameboard);
                continue;
            }
            isTheTournamentWithoutPlayers = false;
            let newGame = new GameTournament_1.GameTournament(gameboard, this, String(this._id));
            let gameId = newGame.getId;
            gameboard.player1.webSocketUserSession.setGameId = gameId;
            gameboard.player2.webSocketUserSession.setGameId = gameId;
            this._gameHandlerAPI.addGameToGlobalGameMap(newGame, gameboard.player1, gameboard.player2);
            this._idsOfGamesRound.push(gameId);
            newGame.createMatch(gameboard.player1, gameboard.player2);
        }
        if (isTheTournamentWithoutPlayers) {
            this._roundStatus = RoundStatus.ROUNDS_ENDED;
        }
    }
    playerMakePoint(gameScoreboard) {
        this._overallScoreboardOfTheRound.addGameScoreboard(gameScoreboard);
        this.sendMessageOverallScoreboard();
    }
    playEnded(gameScoreboard) {
        this._tableOfPoints.addPlayerScore(gameScoreboard);
        this._numberOfGamesCompletedInTheRound++;
    }
    sendMessageOverallScoreboard() {
        this.broadcast('TOURNAMENT_OVERALL_SCOREBOARD', this._overallScoreboardOfTheRound.getRoundScoreboardJSONToClients());
    }
    sendMessageTableOfPoints() {
        this.broadcast('TOURNAMENT_TABLE_OF_POINTS', this._tableOfPoints.getTableJSONToclients());
    }
    sendMessagePlayerFinalPosition(player) {
        this.sendMessageToPlayer(player, 'TOURNAMENT_PLAYER_FINAL_POSITION', player.position);
    }
    broadcast(messageType, obj) {
        for (const tournamentPlayer of this._tournamentPlayers.values()) {
            this.sendMessageToPlayer(tournamentPlayer, messageType, obj);
        }
    }
    sendMessageToPlayer(player, messageType, obj) {
        if (this._tournamentStatus === TournamentStatus.FINISHED)
            return;
        if (!player.isOnline)
            return;
        let sender = new Sender_1.Sender(player.webSocketUserSession.getWebsocket);
        let messageToSend = (obj === undefined)
            ? new Message_1.Message(messageType)
            : new MessageWithValue_1.MessageWithValue(messageType, obj);
        sender.sendMessage(messageToSend);
    }
}
exports.Tournament = Tournament;
Tournament.MAX_PLAYERS = 16;
