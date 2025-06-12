import { WebSocketUserSessionListener } from '../WebSocketUserSessionListener';
import { WebSocketUserSession } from '../WebSocketUserSession';
import { Game } from '../game/Game';
import { Message } from '../message/Message';
import { Sender } from '../Sender';
import WebSocket from 'ws';
import { GamePlayer } from '../game/GamePlayer';
import { GameGlobal } from '../game/GameGlobal';

export class GameHandlerAPI implements WebSocketUserSessionListener {

	private waitingPlayer: GamePlayer | null = null;

	private gamesGlobal = new Map<number, Game>();
	private gamePlayers = new Map<WebSocketUserSession, GamePlayer>();

	message(ws: WebSocketUserSession, messageFromClient: Message): void {

		const sender = new Sender(ws.getWebsocket);

		let gamePlayer = this.gamePlayers.get(ws);
		if (!gamePlayer){
			gamePlayer = new GamePlayer(true, ws);
			this.gamePlayers.set(ws, gamePlayer);
		}

		if (messageFromClient.getType === 'GAME_CREATE_GLOBAL_MATCH') {

			if (this.waitingPlayer === gamePlayer || this.waitingPlayer === null || (this.waitingPlayer.webSocketUserSession.getWebsocket.readyState !== WebSocket.OPEN)) {
				this.waitingPlayer = gamePlayer;
				sender.sendMessage(new Message('GAME_WAITING_NEW_PLAYER'));
			} else {
				let game = new GameGlobal();

				const gameId = game.getId;

				this.waitingPlayer.webSocketUserSession.setGameId = gameId;
				ws.setGameId = gameId;

				this.gamesGlobal.set(gameId, game);

				game.createMatch(this.waitingPlayer, gamePlayer);
				this.waitingPlayer = null;
			}
			return;
		}

		if (messageFromClient.getType === 'GAME_ABORT' && gamePlayer === this.waitingPlayer) {
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
			playerGame.movePaddle(gamePlayer, messageFromClient.getType);
		}

	}

	close(ws: WebSocketUserSession): void {

		let gamePlayer = this.gamePlayers.get(ws);

		if (gamePlayer === this.waitingPlayer) {
			this.waitingPlayer === null;
			return;
		}

		let playerGame = this.getPlayerGame(ws);
		if (!playerGame) {
			return;
		}

		playerGame.playerExit(gamePlayer!);
	}

	public getMapgamesGlobal() : Map<number, Game>{
		return this.gamesGlobal;
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