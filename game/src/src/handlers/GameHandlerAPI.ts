import { WebSocketUserSessionListener } from '../WebSocketUserSessionListener';
import { WebSocketUserSession } from '../WebSocketUserSession';
import { Game } from '../game/Game';
import { Message } from '../message/Message';
import { Sender } from '../Sender';
import WebSocket from 'ws';

export class GameHandlerAPI implements WebSocketUserSessionListener {

	private waitingPlayer: WebSocketUserSession | null = null;

	private gamesGlobal = new Map<Number, Game>();


	message(ws: WebSocketUserSession, messageFromClient: Message): void {

		const sender = new Sender(ws.getWebsocket);

		if (messageFromClient.getType === 'GAME_CREATE_GLOBAL_MATCH') {

			if (this.waitingPlayer === ws) {
				return;
			} else if (this.waitingPlayer === null || (this.waitingPlayer.getWebsocket.readyState !== WebSocket.OPEN)) {
				this.waitingPlayer = ws;
				sender.sendMessage(new Message('GAME_WAITING_NEW_PLAYER'));
			} else {
				let game = new Game();

				const gameId = game.getId;

				this.waitingPlayer.setGameId = gameId;
				ws.setGameId = gameId;

				this.gamesGlobal.set(gameId, game);

				game.createMatch(this.waitingPlayer, ws);
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
			playerGame.movePaddle(ws, messageFromClient.getType);
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

		playerGame.playerExit(ws);
	}

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