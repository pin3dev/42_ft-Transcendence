import { Game } from "../game/Game";
import { Message } from "../message/Message";


export class C {

	public handlerGame(game: Game, messageFromClient: Message) {

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
}