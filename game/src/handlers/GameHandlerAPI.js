import { Message } from '../message/Message.js';
import { Sender } from '../Sender.js';
import WebSocket from 'ws';
import { GamePlayer } from '../game/GamePlayer.js';
import { GameGlobal } from '../game/GameGlobal.js';
/*

let gamePlayer = this.gamePlayers.get(ws);
if (!gamePlayer){
    gamePlayer = new GamePlayer(true, ws);
    this.gamePlayers.set(ws, gamePlayer);
}

*/
export class GameHandlerAPI {
    waitingPlayer = null;
    gamesGlobal = new Map();
    gamePlayers = new Map();
    message(ws, messageFromClient) {
        const sender = new Sender(ws.getWebsocket);
        if (messageFromClient.getType === 'GAME_CREATE_GLOBAL_MATCH') {
            if (this.waitingPlayer === ws || this.waitingPlayer === null || (this.waitingPlayer.getWebsocket.readyState !== WebSocket.OPEN)) {
                this.waitingPlayer = ws;
                sender.sendMessage(new Message('GAME_WAITING_NEW_PLAYER'));
            }
            else {
                let game = new GameGlobal();
                let gamePlayerLeft = new GamePlayer(true, this.waitingPlayer);
                let gamePlayerRight = new GamePlayer(true, ws);
                this.addGameToGlobalGameMap(game, gamePlayerLeft, gamePlayerRight);
                game.createMatch(gamePlayerLeft, gamePlayerRight);
                this.waitingPlayer = null;
            }
            return;
        }
        if (messageFromClient.getType === 'GAME_ABORT' && ws === this.waitingPlayer) {
            this.waitingPlayer = null;
            sender.sendMessage(new Message('GAME_ABORTED'));
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
    /*
    public getMapgamesGlobal(): Map<number, Game> {
        return this.gamesGlobal;
    }
    */
    getPlayerGame(wsSession) {
        const gameId = wsSession.getGameId;
        const sender = new Sender(wsSession.getWebsocket);
        let playerGame = this.gamesGlobal.get(gameId);
        if (!playerGame) {
            sender.sendMessage(new Message('ERROR_MATCH_DOES_NOT_EXIST'));
        }
        return playerGame;
    }
}
