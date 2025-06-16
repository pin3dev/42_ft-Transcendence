import { GameScoreboard } from "../game/GameScoreboard.js";
import { Message } from "../message/Message.js";
import { MessageWithValue } from "../message/MessageWithValue.js";
import { Sender } from "../Sender.js";
import { GameTournament } from "./GameTournament.js";
import { MakeRounds } from "./MakeRounds.js";
import { OverallScoreboardOfTheRound } from "./OverallScoreboardOfTheRound.js";
import { TableOfPoints } from "./TableOfPoints.js";
import { TournamentPlayer } from "./TournamentPlayer.js";
export var TournamentStatus;
(function (TournamentStatus) {
    TournamentStatus[TournamentStatus["WAITING_PLAYERS"] = 0] = "WAITING_PLAYERS";
    TournamentStatus[TournamentStatus["READY"] = 1] = "READY";
    TournamentStatus[TournamentStatus["RUNNING"] = 2] = "RUNNING";
    TournamentStatus[TournamentStatus["FINISHED"] = 3] = "FINISHED";
})(TournamentStatus || (TournamentStatus = {}));
export var RoundStatus;
(function (RoundStatus) {
    RoundStatus[RoundStatus["COUNT_DOWN"] = 0] = "COUNT_DOWN";
    RoundStatus[RoundStatus["WAITING_COUNTDOWN"] = 1] = "WAITING_COUNTDOWN";
    RoundStatus[RoundStatus["CREATE_ROUND"] = 2] = "CREATE_ROUND";
    RoundStatus[RoundStatus["ROUND_GOING_ON"] = 3] = "ROUND_GOING_ON";
    RoundStatus[RoundStatus["ROUNDS_ENDED"] = 4] = "ROUNDS_ENDED";
})(RoundStatus || (RoundStatus = {}));
export class Tournament {
    static MAX_PLAYERS = 16;
    _id = 1;
    _numberOfPlayer = 0;
    _tournamentPlayers;
    _gameHandlerAPI;
    _idsOfGamesRound;
    // overall tournament ranking
    _tableOfPoints;
    // all round scores
    _overallScoreboardOfTheRound = new OverallScoreboardOfTheRound();
    _tournamentStatus;
    // maximum number of rounds in the tournament
    _roundCount;
    _roundCountMaxRounds;
    // counter of the maximum number of games per round
    _numberOfGamesCompletedInTheRound;
    _numberOfGamesCompletedInTheRoundMaxPossible;
    //interval values
    mainInterval;
    countDownInterval;
    _roundStatus;
    _countDown;
    _makeRound;
    constructor(numberOfPlayer, gameHandlerAPI) {
        this._numberOfPlayer = numberOfPlayer;
        this._gameHandlerAPI = gameHandlerAPI;
        this._idsOfGamesRound = [];
        this._tournamentPlayers = new Map();
        this._tableOfPoints = new TableOfPoints();
        this._tournamentStatus = TournamentStatus.WAITING_PLAYERS;
        this._roundCount = 0;
        this._roundCountMaxRounds = numberOfPlayer - 1;
        this._numberOfGamesCompletedInTheRound = 0;
        this._numberOfGamesCompletedInTheRoundMaxPossible = numberOfPlayer / 2;
        this._roundStatus = RoundStatus.COUNT_DOWN;
        this._countDown = 3;
        this._makeRound = new MakeRounds(null);
    }
    /**
     *
     * @param webSocketUserSession
     *
     * @returns true if tournament is full and ready to running, if error or not full, false is returned
     */
    addPlayer(webSocketUserSession) {
        const sender = new Sender(webSocketUserSession.getWebsocket);
        if (this._tournamentStatus === TournamentStatus.FINISHED) {
            sender.sendMessage(new Message('ERROR_TOURNAMENT_FINISHED'));
            return false;
        }
        if (this._tournamentStatus === TournamentStatus.RUNNING) {
            sender.sendMessage(new Message('ERROR_TOURNAMENT_IN_PROGRESS'));
            return false;
        }
        if (this._tournamentPlayers.size === this._numberOfPlayer) {
            sender.sendMessage(new Message('ERROR_TOURNARMENT_FULL'));
            return false;
        }
        // check if the websocket is not already in the tournament
        if (webSocketUserSession.getTournamentId === this._id) {
            sender.sendMessage(new Message('ERROR_TOURNAMENT_ALREADY_PARTICIPATING'));
            return false;
        }
        // check if the user is not already in the tournament
        for (let webSocketUserSessionAlreadyInTheTournament of this._tournamentPlayers.keys()) {
            if (webSocketUserSession.getUserId === webSocketUserSessionAlreadyInTheTournament.getUserId) {
                sender.sendMessage(new Message('ERROR_TOURNAMENT_ALREADY_PARTICIPATING'));
                return false;
            }
        }
        // add the id of this tournament in webSocketUserSession to make it easier
        // to search and know that the player's game is part of this tournament
        webSocketUserSession.setTournamentId = this._id;
        let tournamentPlayer = new TournamentPlayer(true, webSocketUserSession);
        this._tournamentPlayers.set(webSocketUserSession, tournamentPlayer);
        this._tableOfPoints.addPlayer(tournamentPlayer);
        sender.sendMessage(new Message('TOURNAMENT_WAITING_PLAYER'));
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
        this._makeRound = new MakeRounds(Array.from(this._tournamentPlayers.values()));
        this._roundStatus = RoundStatus.COUNT_DOWN;
        this._tournamentStatus = TournamentStatus.RUNNING;
        this.tournamentLoop();
    }
    getStatus() {
        return this._tournamentStatus;
    }
    //--- private methods ---
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
            //clear player values;
            playerTornament.webSocketUserSession.setGameId = 0;
            playerTornament.webSocketUserSession.setTournamentId = 0;
        }
    }
    doRound() {
        // 1) countDeJogosDaRodada = 0;
        // 2) limpar mapa de jogos da rodada do torneio
        // 3) pegar uma rodada no mapa de jogos do torneio
        // 4) criar a lista de Gamescoreboard
        // 5) criar a table de jogos da rodada e enviar para todos jogadores
        // 6) enviar a tabela de pontos do torneio para todos os jogadores do torneio
        // 7) criar os games das partidas (remover o id antigo do game do jogador para nao dar bug e add o do novo jogo)
        // na hora de criar os games tournamentPlayer offline vs tournamenPlayer offline tem que incrementar o countador de jogos da rodada para nao ter bug de espera infinita
        // ter um contador da hora de criar o jogos, pois se todos os jogos forem null, temos que terminar o torneio, nao faz sentido ter jogadores fantasmas!
        //rest values to a new round
        /* 1 */ this._numberOfGamesCompletedInTheRound = 0;
        /* 2 */ for (const idOfGamesInTheRound of this._idsOfGamesRound) {
            this._gameHandlerAPI.removeGameToGlobalGameMap(idOfGamesInTheRound);
        }
        this._idsOfGamesRound = [];
        //get a new pairs of games to this round
        /* 3 */ let roundPairs = this._makeRound.getARound();
        //create a new overall scoreboard to this round
        this._overallScoreboardOfTheRound = new OverallScoreboardOfTheRound();
        let arrayOfGamescoreboardToThisRound = [];
        for (const playersOfGame of roundPairs) {
            const gameScoreboard = new GameScoreboard(playersOfGame[0], playersOfGame[1]);
            /* 4 */ arrayOfGamescoreboardToThisRound.push(gameScoreboard);
            this._overallScoreboardOfTheRound.addGameScoreboard(gameScoreboard);
        }
        /* 5 */ this.sendMessageOverallScoreboard();
        /* 6 */ this.sendMessageTableOfPoints();
        let isTheTournamentWithoutPlayers = true;
        /* 7 */ for (const gameboard of arrayOfGamescoreboardToThisRound) {
            // If both players are offline there is no reason to play,
            // we will count this match and continue
            if (!gameboard.player1.isOnline && !gameboard.player2.isOnline) {
                this.playEnded(gameboard);
                continue;
            }
            // variable to check if no players are online. If all players have left, no games will be created, so the tournament should stop
            isTheTournamentWithoutPlayers = false;
            let newGame = new GameTournament(gameboard, this);
            let gameId = newGame.getId;
            //add the new gameId for the players so that when they send the messages it doesn't give an invalid match
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
    // ------------------- interfaces methods start -------------------
    playerMakePoint(gameScoreboard) {
        this._overallScoreboardOfTheRound.addGameScoreboard(gameScoreboard);
        this.sendMessageOverallScoreboard();
    }
    playEnded(gameScoreboard) {
        //change gameScoreboard status
        this._tableOfPoints.addPlayerScore(gameScoreboard);
        this._numberOfGamesCompletedInTheRound++;
    }
    // ------------------- interfaces methods end -------------------
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
        let sender = new Sender(player.webSocketUserSession.getWebsocket);
        let messageToSend = (obj === undefined)
            ? new Message(messageType)
            : new MessageWithValue(messageType, obj);
        sender.sendMessage(messageToSend);
    }
}
