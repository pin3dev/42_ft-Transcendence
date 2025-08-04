"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameHandlerAPI = void 0;
const Message_1 = require("../message/Message");
const Sender_1 = require("../Sender");
const ws_1 = __importDefault(require("ws"));
const GamePlayer_1 = require("../game/GamePlayer");
const GameGlobal_1 = require("../game/GameGlobal");
class GameHandlerAPI {
    constructor() {
        this.waitingPlayer = null;
        this.gamesGlobal = new Map();
        this.gamePlayers = new Map();
    }
    message(ws, messageFromClient) {
        const sender = new Sender_1.Sender(ws.getWebsocket);
        if (messageFromClient.getType === 'GAME_CREATE_GLOBAL_MATCH') {
            if (this.waitingPlayer === ws || this.waitingPlayer === null || (this.waitingPlayer.getWebsocket.readyState !== ws_1.default.OPEN)) {
                this.waitingPlayer = ws;
                sender.sendMessage(new Message_1.Message('GAME_WAITING_NEW_PLAYER'));
            }
            else {
                let game = new GameGlobal_1.GameGlobal(null);
                let gamePlayerLeft = new GamePlayer_1.GamePlayer(true, this.waitingPlayer);
                let gamePlayerRight = new GamePlayer_1.GamePlayer(true, ws);
                this.addGameToGlobalGameMap(game, gamePlayerLeft, gamePlayerRight);
                game.createMatch(gamePlayerLeft, gamePlayerRight);
                this.waitingPlayer = null;
            }
            return;
        }
        if (messageFromClient.getType === 'GAME_ABORT' && ws === this.waitingPlayer) {
            this.waitingPlayer = null;
            sender.sendMessage(new Message_1.Message('GAME_ABORTED'));
            return;
        }
        let playerGame = this.getPlayerGame(ws);
        if (!playerGame) {
            return;
        }
        if (messageFromClient.getType === 'GAME_ABORT') {
            playerGame.abort();
            let gameId = playerGame.getId;
            this.gamesGlobal.delete(gameId);
        }
        else if (messageFromClient.getType === 'GAME_START_MATCH') {
            let confirmedNumber = playerGame.addConfirmation(ws);
            if (confirmedNumber === 2) {
                playerGame.startGame();
            }
        }
        else if (messageFromClient.getType === 'GAME_PADDLE_UP_KEYUP' ||
            messageFromClient.getType === 'GAME_PADDLE_UP_KEYDOWN' ||
            messageFromClient.getType === 'GAME_PADDLE_DOWN_KEYUP' ||
            messageFromClient.getType === 'GAME_PADDLE_DOWN_KEYDOWN') {
            let gamePlayer = this.gamePlayers.get(ws);
            if (gamePlayer) {
                playerGame.movePaddle(gamePlayer, messageFromClient.getType);
            }
            else {
                console.error('GameHandlerAPI: message: Unable to find player on player map');
            }
        }
    }
    close(ws) {
        if (ws === this.waitingPlayer) {
            this.waitingPlayer === null;
            return;
        }
        let playerGame = this.getPlayerGame(ws);
        if (!playerGame) {
            return;
        }
        let gamePlayer = this.gamePlayers.get(ws);
        if (gamePlayer === undefined) {
            console.error('GameHandlerAPI: close: Unable to find player on player map');
        }
        else {
            playerGame.playerExit(gamePlayer);
        }
    }
    addGameToGlobalGameMap(game, gamePlayerLeft, gamePlayerRight) {
        gamePlayerLeft.webSocketUserSession.setGameId = game.getId;
        gamePlayerRight.webSocketUserSession.setGameId = game.getId;
        this.gamePlayers.set(gamePlayerLeft.webSocketUserSession, gamePlayerLeft);
        this.gamePlayers.set(gamePlayerRight.webSocketUserSession, gamePlayerRight);
        this.gamesGlobal.set(game.getId, game);
    }
    removeGameToGlobalGameMap(gameId) {
        this.gamesGlobal.delete(gameId);
    }
    getPlayerGame(wsSession) {
        const gameId = wsSession.getGameId;
        const sender = new Sender_1.Sender(wsSession.getWebsocket);
        let playerGame = this.gamesGlobal.get(gameId);
        if (!playerGame) {
            sender.sendMessage(new Message_1.Message('ERROR_MATCH_DOES_NOT_EXIST'));
        }
        return playerGame;
    }
}
exports.GameHandlerAPI = GameHandlerAPI;
