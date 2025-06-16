import { WebSocketUserSessionListener } from '../WebSocketUserSessionListener';
import { WebSocketUserSession } from '../WebSocketUserSession';
import { Game } from '../game/Game';
import { Message } from '../message/Message';
import { Sender } from '../Sender';
import WebSocket from 'ws';
import { GamePlayer } from '../game/GamePlayer';
import { GameGlobal } from '../game/GameGlobal';

export class GameHandlerAPI implements WebSocketUserSessionListener {

	private waitingPlayer: WebSocketUserSession | null = null;

	private gamesGlobal = new Map<number, Game>();
	private gamePlayers = new Map<WebSocketUserSession, GamePlayer>();

	message(ws: WebSocketUserSession, messageFromClient: Message): void {

		const sender = new Sender(ws.getWebsocket);

		if (messageFromClient.getType === 'GAME_CREATE_GLOBAL_MATCH') {

			if (this.waitingPlayer === ws || this.waitingPlayer === null || (this.waitingPlayer.getWebsocket.readyState !== WebSocket.OPEN)) {
				this.waitingPlayer = ws;
				sender.sendMessage(new Message('GAME_WAITING_NEW_PLAYER'));
			} else {
				let game = new GameGlobal(null);

				let gamePlayerLeft: GamePlayer = new GamePlayer(true, this.waitingPlayer);
				let gamePlayerRight: GamePlayer = new GamePlayer(true, ws);

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
			}else {
				console.error('GameHandlerAPI: message: Unable to find player on player map');
			}
		}

	}

	close(ws: WebSocketUserSession): void {

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
		}else{
			playerGame.playerExit(gamePlayer);
		}
	}

	public addGameToGlobalGameMap(game: Game, gamePlayerLeft: GamePlayer, gamePlayerRight: GamePlayer) {

		gamePlayerLeft.webSocketUserSession.setGameId = game.getId;
		gamePlayerRight.webSocketUserSession.setGameId = game.getId;

		this.gamePlayers.set(gamePlayerLeft.webSocketUserSession, gamePlayerLeft);
		this.gamePlayers.set(gamePlayerRight.webSocketUserSession, gamePlayerRight);

		this.gamesGlobal.set(game.getId, game);
	}

	public removeGameToGlobalGameMap(gameId : number){
		this.gamesGlobal.delete(gameId);
	}

	/*
	public getMapgamesGlobal(): Map<number, Game> {
		return this.gamesGlobal;
	}
	*/

	private getPlayerGame(wsSession: WebSocketUserSession): Game | undefined {
		const gameId = wsSession.getGameId;
		const sender = new Sender(wsSession.getWebsocket);

		let playerGame = this.gamesGlobal.get(gameId);
		if (!playerGame) {
			sender.sendMessage(new Message('ERROR_MATCH_DOES_NOT_EXIST'));
		}
		return playerGame;
	}
}