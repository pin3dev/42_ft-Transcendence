import { Message, MessageType } from "../message/Message";
import { Sender } from "../Sender";
import { WebSocketUserSession } from "../WebSocketUserSession";
import { Ball } from "./Ball";
import { Paddle } from "./Paddle";

export type GameStatus = 'NOT_READY' | 'RUNNING' | 'FINISHED';

export class Game {

	private static readonly START_COUNT_DOWN_VALUE = 3;

	//fps values
	private static readonly MININUM_FPS_SPEED = 10;
	private static readonly START_FPS_SPEED = 25;

	private static matchIdCounter: number = 1;

	private static readonly FIELD_WIDTH: number = 800;
	private static readonly FIELD_HEIGHT: number = 600;

	private id: number = 0;

	private arrayPlayers: WebSocketUserSession[] = [];
	private arrayPaddles: Paddle[] = [];
	private ball: Ball;

	private scores: number[] = [];

	private gameLoopInterval: NodeJS.Timeout | undefined;
	private fpsSpeepInterval: NodeJS.Timeout | undefined;
	private countDownInterval: NodeJS.Timeout | undefined;

	private countDown = Game.START_COUNT_DOWN_VALUE;

	private gameStatus: GameStatus;

	private confirmed: Set<WebSocketUserSession>;

	private fps: number = Game.START_FPS_SPEED;

	constructor() {
		this.gameStatus = 'NOT_READY';
		this.ball = new Ball(Game.FIELD_WIDTH / 2, Game.FIELD_HEIGHT / 2);
		this.gameLoopInterval = undefined;
		this.fpsSpeepInterval = undefined;
		this.countDownInterval = undefined;
		this.confirmed = new Set<WebSocketUserSession>();

		this.id = Game.matchIdCounter++;
	}

	public createMatch(player1: WebSocketUserSession, player2: WebSocketUserSession) {

		this.arrayPlayers[0] = player1;
		this.arrayPlayers[1] = player2;

		const middleYtoPaddles = (Game.FIELD_HEIGHT - Paddle.HEIGHT) / 2;

		this.arrayPaddles[0] = new Paddle(10, middleYtoPaddles);
		this.arrayPaddles[1] = new Paddle(Game.FIELD_WIDTH - 10, middleYtoPaddles);

		this.scores = [0, 0];

		this.sendMessageGameCanStart();
	}

	public startGame() {
		this.gameStatus = 'RUNNING';
		this.sendMessageGameFull();
		this.makeCountDownRoutine();
	}

	public movePaddle(player: WebSocketUserSession, paddleDirection: MessageType) {

		if (this.gameStatus !== 'RUNNING') return;

		const paddleToMove = (player === this.arrayPlayers[0] ? this.arrayPaddles[0] : this.arrayPaddles[1]);
		const speed = 10;

		if (paddleDirection === 'GAME_PADDLE_UP') {
			paddleToMove.setY = Math.max(0, paddleToMove.getY - speed);
		} else if (paddleDirection === 'GAME_PADDLE_DOWN') {
			paddleToMove.setY = Math.min(Game.FIELD_HEIGHT - Paddle.HEIGHT, paddleToMove.getY + speed);
		}
	}

	public get getId() {
		return this.id;
	}

	public addConfirmation(wsSession: WebSocketUserSession): number {
		this.confirmed.add(wsSession);
		return this.confirmed.size;
	}

	public abort() {
		if (this.gameStatus !== 'RUNNING') return;
		this.broadcast('GAME_ABORTED', '');
		this.stop();
	}

	public playerExit(wsSession: WebSocketUserSession) {

		let playerSession = (wsSession === this.arrayPlayers[0]) ? this.arrayPlayers[0] : this.arrayPlayers[1];
		this.broadcast('GAME_ABORTED', '');
		this.stop();
	}



	// ----------------------------- stop routines -----------------------------
	private stopCountDownRoutine(){
		if (this.countDownInterval){
			clearInterval(this.countDownInterval);
			this.countDownInterval = undefined;
		}
	}
	private stopGameLoopRoutine(){
		if (this.gameLoopInterval) {
			clearInterval(this.gameLoopInterval);
			this.gameLoopInterval = undefined;
		}
	}
	private stopFpsSpeedRoutine(){
		if (this.fpsSpeepInterval) {
			clearInterval(this.fpsSpeepInterval);
			this.fpsSpeepInterval = undefined;
		}
	}
    // --------------------------- end stop routines ---------------------------

	private stop() {
		this.gameStatus = 'FINISHED';

		this.stopCountDownRoutine();
		this.stopFpsSpeedRoutine();
		this.stopGameLoopRoutine();
	}

	private fpsSpeedRoutine() {
		if (this.fpsSpeepInterval) {
			clearInterval(this.fpsSpeepInterval);
		}
		this.fpsSpeepInterval = setInterval(() => {
			if (this.fps > Game.MININUM_FPS_SPEED) {
				this.fps--;
				this.changeGameLoopInterval();
			}
		}, 1500);
	}

	private gameLoopRoutine() {

		this.gameLoopInterval = setInterval(() => {

			if (this.gameStatus !== 'RUNNING') return;

			// move ball
			this.ball.setX = this.ball.getX + this.ball.getVX;
			this.ball.setY = this.ball.getY + this.ball.getVY;

			// Bounce the ball off the upper/lower walls
			if (this.ball.getY <= 0 || this.ball.getY + Ball.SIZE >= Game.FIELD_HEIGHT) {
				this.ball.setVY = this.ball.getVY * -1;
			}

			// check hit the ball on the paddle
			let paddle1 = this.arrayPaddles[0];
			let paddle2 = this.arrayPaddles[1];

			if (this.paddleCollision(paddle1) && this.ball.getVX < 0) {
				this.ball.setVX = this.ball.getVX * -1;
			} else if (this.paddleCollision(paddle2) && this.ball.getVX > 0) {
				this.ball.setVX = this.ball.getVX * -1;
			}

			// Check if any player scored the point
			if (this.ball.getX < 0) {
				// point for player 2
				this.scores[1]++;
				this.resetBall();
			} else if (this.ball.getX > Game.FIELD_WIDTH) {
				// point for player 1
				this.scores[0]++;
				this.resetBall();
			}

			// Send the game status to client
			this.sendMessageGameStatus();

			// Send updated game status
			if (this.scores[0] >= 5) {
				this.sendMessageToPlayer(this.arrayPlayers[0], 'GAME_PLAYER_WIN', '');
				this.sendMessageToPlayer(this.arrayPlayers[1], 'GAME_PLAYER_LOSE', '');
				this.stop();
			} else if (this.scores[1] >= 5) {
				this.sendMessageToPlayer(this.arrayPlayers[0], 'GAME_PLAYER_LOSE', '');
				this.sendMessageToPlayer(this.arrayPlayers[1], 'GAME_PLAYER_WIN', '');
				this.stop();
			}
		}, this.fps);

	}

	private makeCountDownRoutine() {
		this.countDownInterval = setInterval(() => {
			this.sendMessageGameCountdown(this.countDown);
			this.countDown--;
			if (this.countDown < 0) {
				this.stopCountDownRoutine();
				this.gameLoopRoutine();
				this.fpsSpeedRoutine();
			}
		}, 1000);
	}

	private changeGameLoopInterval() {
		clearInterval(this.gameLoopInterval);
		this.gameLoopRoutine();
	}

	private resetBall() {
		this.ball.setX = Game.FIELD_WIDTH / 2;
		this.ball.setY = Math.floor(Math.random() * ((Game.FIELD_HEIGHT - 10) - 10 + 1)) + 10;
		this.ball.setVX = (Math.random() > 0.5 ? 1 : -1) * 5;
		this.ball.setVY = (Math.random() > 0.5 ? 1 : -1) * 3;
		this.fps = Game.START_FPS_SPEED;
		this.changeGameLoopInterval();
	}

	private paddleCollision(paddle: Paddle) {
		return (
			this.ball.getX <= paddle.getX + Paddle.WIDTH &&
			this.ball.getX + Ball.SIZE >= paddle.getX &&
			this.ball.getY + Ball.SIZE >= paddle.getY &&
			this.ball.getY <= paddle.getY + Paddle.HEIGHT
		);
	}

	private sendMessageGameCanStart(): void {
		this.broadcast('GAME_CAN_START', '');
	}

	private sendMessageGameFull() {
		this.broadcast('GAME_FULL', {
			id: this.id,
			field_width: Game.FIELD_WIDTH,
			field_height: Game.FIELD_HEIGHT,
			paddle_height: Paddle.HEIGHT,
			paddle_width: Paddle.WIDTH,
			paddle_player_1_height_position: this.arrayPaddles[0].getY,
			paddle_player_1_width_position: this.arrayPaddles[0].getX,
			paddle_player_2_height_position: this.arrayPaddles[1].getY,
			paddle_player_2_width_position: this.arrayPaddles[1].getX,
			ball_size: Ball.SIZE,
			ball_height_position: this.ball.getY,
			ball_width_position: this.ball.getX,
			scoreboard_player_1: this.scores[0],
			scoreboard_player_2: this.scores[1]
		});
	}

	private sendMessageGameCountdown(second: number) {
		this.broadcast('GAME_COUNT_DOWN', second);
	}

	private sendMessageGameStatus() {
		this.broadcast('GAME_STATUS', {
			paddle_player_1_height_position: this.arrayPaddles[0].getY,
			paddle_player_2_height_position: this.arrayPaddles[1].getY,
			ball_height_position: this.ball.getY,
			ball_width_position: this.ball.getX,
			scoreboard_player_1: this.scores[0],
			scoreboard_player_2: this.scores[1]
		});
	}

	private broadcast(messageType: MessageType, obj: Object) {
		this.sendMessageToPlayer(this.arrayPlayers[0], messageType, obj);
		this.sendMessageToPlayer(this.arrayPlayers[1], messageType, obj);
	}

	private sendMessageToPlayer(player: WebSocketUserSession, messageType: MessageType, obj: Object) {
		let sender = new Sender(player.getWebsocket);

		let messageToSend = new Message(messageType, obj);

		sender.sendMessage(messageToSend);
	}

}