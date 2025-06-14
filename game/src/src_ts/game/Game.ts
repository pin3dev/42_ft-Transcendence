import { Ball } from "./Ball";
import { Field } from "./Field";
import { Paddle } from "./Paddle"
import { Message, MessageType } from "../message/Message";
import { MessageWithValue } from "../message/MessageWithValue";
import { WebSocketUserSession } from "../WebSocketUserSession";
import { Sender } from "../Sender";
import { GamePlayer } from "./GamePlayer";
import { SaveRating } from "./SaveRating";
import { GameScoreboard } from "./GameScoreboard";
import { Tournament } from "../tournament/Tournament";
import { TournamentPlayer } from "../tournament/TournamentPlayer";
import { TypeOfEnvironment } from "../ParametersVariables";

export type GameStatus2 = 'NOT_READY' | 'READY' | 'RUNNING' | 'FINISHED';
export type GamePlayersStatus = 'ON_LINE' | 'PLAYER_1_DISCONNECTED' | 'PLAYER_2_DISCONNECTED';

export abstract class Game {

	private static readonly PLAYER_1: number = 0;
	private static readonly PLAYER_2: number = 1;

	public static readonly MAX_POINTS = 10;
	public static readonly WINNING_SCORE = (this.MAX_POINTS / 2) + 1;
	private static matchIdCounter: number = 1;
	private static readonly START_COUNT_DOWN_VALUE = 3;

	private gamePlayers: GamePlayer[];
	private players: Paddle[] = [];
	private scoreboard: number[] = [0, 0];
	private ball: Ball;

	private gameStatus: GameStatus2;
	private gamePlayersStatus: GamePlayersStatus;

	private id: number = 0;

	private confirmed: Set<WebSocketUserSession>;

	private gameLoopInterval: NodeJS.Timeout | undefined;
	private countDownInterval: NodeJS.Timeout | undefined;

	private countDown = Game.START_COUNT_DOWN_VALUE;

	private saveRating : SaveRating;

	private keys = {
		paddle_left_up: false,
		paddle_left_down: false,
		paddle_right_up: false,
		paddle_right_down: false
	};

	constructor() {
		this.gamePlayers = [];
		this.players[0] = new Paddle(Paddle.SPACE_FROM_SIDE, Field.HEIGHT / 2 - Paddle.HEIGHT / 2, 0);
		this.players[1] = new Paddle(Field.WIDTH - Paddle.SPACE_FROM_SIDE - Paddle.WIDTH, Field.HEIGHT / 2 - Paddle.HEIGHT / 2, 0);
		this.ball = new Ball(Field.WIDTH / 2, Field.HEIGHT / 2);

		this.gameStatus = 'NOT_READY';
		this.gamePlayersStatus = 'ON_LINE';

		this.id = Game.matchIdCounter++;
		this.confirmed = new Set<WebSocketUserSession>();

		this.gameLoopInterval = undefined;
		this.countDownInterval = undefined;

		this.saveRating = new SaveRating();
	}

	public createMatch(player1: GamePlayer, player2: GamePlayer) {
		this.gamePlayers[Game.PLAYER_1] = player1;
		this.gamePlayers[Game.PLAYER_2] = player2;

		if (!player1.isOnline) {
			this.gameEndedWithWO(player2);
		} else if (!player2.isOnline) {
			this.gameEndedWithWO(player1);
		} else {
			this.sendMessageGameCanStart();
		}
	}

	public addConfirmation(wsSession: WebSocketUserSession): number {
		this.confirmed.add(wsSession);
		return this.confirmed.size;
	}

	public startGame() {
		this.gameStatus = 'READY';
		this.sendMessageGameFull();
		this.makeCountDownRoutine();
	}

	public movePaddle(player: GamePlayer, paddleDirection: MessageType) {

		if (this.gameStatus !== 'RUNNING') return;

		if (player === this.gamePlayers[Game.PLAYER_1]) {
			if (paddleDirection === 'GAME_PADDLE_UP_KEYDOWN') {
				this.keys.paddle_left_up = true;
			} else if (paddleDirection === 'GAME_PADDLE_UP_KEYUP') {
				this.keys.paddle_left_up = false;
			} else if (paddleDirection === 'GAME_PADDLE_DOWN_KEYDOWN') {
				this.keys.paddle_left_down = true;
			} else if (paddleDirection === 'GAME_PADDLE_DOWN_KEYUP') {
				this.keys.paddle_left_down = false;
			}
			this.updatePaddleSpeeds();
		}
		else if (player === this.gamePlayers[Game.PLAYER_2]) {
			if (paddleDirection === 'GAME_PADDLE_UP_KEYDOWN') {
				this.keys.paddle_right_up = true;
			} else if (paddleDirection === 'GAME_PADDLE_UP_KEYUP') {
				this.keys.paddle_right_up = false;
			} else if (paddleDirection === 'GAME_PADDLE_DOWN_KEYDOWN') {
				this.keys.paddle_right_down = true;
			} else if (paddleDirection === 'GAME_PADDLE_DOWN_KEYUP') {
				this.keys.paddle_right_down = false;
			}
			this.updatePaddleSpeeds();
		}
	}

	// 'NOT_READY' | 'READY' | 'RUNNING' | 'FINISHED';

	public abort() {
		if (this.gameStatus === 'FINISHED') return ;
		this.broadcast('GAME_ABORTED');
		this.stop();
	}

	public playerExit(playerDisconnected: GamePlayer) {

		if (this.gameStatus !== 'RUNNING'){
			this.abort();
		}

		if (playerDisconnected === this.gamePlayers[Game.PLAYER_1]) {
			this.gamePlayersStatus = 'PLAYER_1_DISCONNECTED';
		} else if (playerDisconnected === this.gamePlayers[Game.PLAYER_2]) {
			this.gamePlayersStatus = 'PLAYER_2_DISCONNECTED';
		}
	}

	public get getId() {
		return this.id;
	}

	private makeCountDownRoutine() {
		this.countDownInterval = setInterval(() => {
			this.sendMessageGameCountdown(this.countDown);
			this.countDown--;
			if (this.countDown < 0) {
				this.stopCountDownRoutine();
				this.gameLoopRoutine();
			}
		}, 1000);
	}

	// ----------------------------- stop routines -----------------------------
	private stopCountDownRoutine() {
		if (this.countDownInterval) {
			clearInterval(this.countDownInterval);
			this.countDownInterval = undefined;
		}
	}
	private stopGameLoopRoutine() {
		if (this.gameLoopInterval) {
			clearInterval(this.gameLoopInterval);
			this.gameLoopInterval = undefined;
		}
	}
	// --------------------------- end stop routines ---------------------------

	private stop() {

		this.gameStatus = 'FINISHED';

		this.stopCountDownRoutine();
		this.stopGameLoopRoutine();
	}

	// Updates the paddles speeds
	private updatePaddleSpeeds() {
		this.players[0].speed = 0;
		if (this.keys.paddle_left_up) this.players[0].speed = -Paddle.SPEED;
		if (this.keys.paddle_left_down) this.players[0].speed = Paddle.SPEED;

		this.players[1].speed = 0;
		if (this.keys.paddle_right_up) this.players[1].speed = -Paddle.SPEED;
		if (this.keys.paddle_right_down) this.players[1].speed = Paddle.SPEED;
	}

	private gameLoopRoutine() {
		this.gameStatus = 'RUNNING';
		this.gameLoopInterval = setInterval(() => {
			if (this.gameStatus === 'RUNNING') {
				this.update();
				this.sendMessageGameStatus();
			}
		}, 15);
	}

	// Updates the game state
	private update() {

		// Movement of the paddles
		this.players[0].y = this.players[0].y + this.players[0].speed;
		this.players[1].y = this.players[1].y + this.players[1].speed;

		// Limits the paddles within the canvas
		this.players[0].y = Math.max(0, Math.min(Field.HEIGHT - Paddle.HEIGHT, this.players[0].y));
		this.players[1].y = Math.max(0, Math.min(Field.HEIGHT - Paddle.HEIGHT, this.players[1].y));

		// Ball movement
		this.ball.x = this.ball.x + this.ball.speedX;
		this.ball.y = this.ball.y + this.ball.speedY;

		// Collision with top and bottom edges
		if (this.ball.y <= 0 || this.ball.y >= Field.HEIGHT - Ball.BALL_SIZE) {
			this.ball.speedY = this.ball.speedY * -1;
		}

		// Collision with the paddles
		if (this.checkPaddleCollision(this.players[0], true) || this.checkPaddleCollision(this.players[1], false)) {
			// Increases ball speed with each hit (up to a limit)
			const speedIncrease = 0.2;
			const maxSpeed = 10;

			this.ball.speedX = Math.sign(this.ball.speedX) * Math.min(Math.abs(this.ball.speedX) + speedIncrease, maxSpeed);
		}

		// Check if someone scored a point
		if (this.ball.x < 0) {
			this.scoreboard[Game.PLAYER_2]++;
			this.playerMakePoint(this.gamePlayers[Game.PLAYER_2]);
			this.resetBall();
			this.sendMessageGameStatus();
		} else if (this.ball.x > Field.WIDTH) {
			this.scoreboard[Game.PLAYER_1]++;
			this.playerMakePoint(this.gamePlayers[Game.PLAYER_1]);
			this.resetBall();
			this.sendMessageGameStatus();
		}

		if (this.checkIfAnyPlayerWon() || this.checkIfAPlayerHasDisconnected()) {

			let player1 : TournamentPlayer = new TournamentPlayer(true, this.gamePlayers[Game.PLAYER_1].webSocketUserSession);
			let player2 : TournamentPlayer = new TournamentPlayer(true, this.gamePlayers[Game.PLAYER_2].webSocketUserSession);

			let gameScoreboard = new GameScoreboard(player1, player2);
			gameScoreboard.playerMakePoint(player1, this.scoreboard[Game.PLAYER_1]);
			gameScoreboard.playerMakePoint(player1, this.scoreboard[Game.PLAYER_2]);

			this.saveRating.saveRating(gameScoreboard);

			this.gameEnd();
			this.stop();
		}

	}

	// Check collision with a paddle
	private checkPaddleCollision(player: Paddle, isLeftPaddle: boolean) {

		const paddleRight = player.x + Paddle.WIDTH;
		const paddleBottom = player.y + Paddle.HEIGHT;
		const ballRight = this.ball.x + Ball.BALL_SIZE;
		const ballBottom = this.ball.y + Ball.BALL_SIZE;

		// Check for overlap
		if (ballRight > player.x && this.ball.x < paddleRight &&
			ballBottom > player.y && this.ball.y < paddleBottom) {

			// Calculates where the ball hit the paddle (from -1 to 1)
			const hitPosition = (this.ball.y + Ball.BALL_SIZE / 2 - (player.y + Paddle.HEIGHT / 2)) / (Paddle.HEIGHT / 2);

			// Inverts the X direction and adjusts the Y direction based on the impact location
			this.ball.speedX = -this.ball.speedX * 1.05; // Increase the speed a little
			this.ball.speedY = hitPosition * Math.abs(this.ball.speedX);

			// Adjust position to avoid multiple collisions
			if (isLeftPaddle) {
				this.ball.x = paddleRight;
			} else {
				this.ball.x = player.x - Ball.BALL_SIZE;
			}
			return true;
		}
		return false;
	}

	// Reset the ball in the center
	private resetBall() {
		this.ball.x = Field.WIDTH / 2;
		this.ball.y = Math.floor(Math.random() * ((Field.HEIGHT - 10) - 10 + 1)) + 10;

		// Random direction (but always towards the player who lost the point)
		this.ball.speedX = this.ball.speedX > 0 ? Ball.INITIAL_BALL_SPEED : -Ball.INITIAL_BALL_SPEED;
		this.ball.speedY = (Math.random() * Ball.INITIAL_BALL_SPEED * 2) - Ball.INITIAL_BALL_SPEED;
	}

	private checkIfAPlayerHasDisconnected(): boolean {

		// check by player disconnect
		if (this.gamePlayersStatus === 'PLAYER_1_DISCONNECTED') {
			if (this.scoreboard[Game.PLAYER_2] < this.scoreboard[Game.PLAYER_1]) {
				this.gameEndedInADraw();
			} else {
				this.gameEndedWithVictory(this.gamePlayers[Game.PLAYER_2], this.gamePlayers[Game.PLAYER_1]);
			}
			return true;
		} else if (this.gamePlayersStatus === 'PLAYER_2_DISCONNECTED') {
			if (this.scoreboard[Game.PLAYER_1] < this.scoreboard[Game.PLAYER_2]) {
				this.gameEndedInADraw();
			} else {
				this.gameEndedWithVictory(this.gamePlayers[Game.PLAYER_1], this.gamePlayers[Game.PLAYER_2]);
			}
			return true;
		}
		return false;
	}

	// Update the scoreboard
	private checkIfAnyPlayerWon() {

		// Check if someone won
		if (this.scoreboard[Game.PLAYER_1] >= Game.WINNING_SCORE) {
			this.gameEndedWithVictory(this.gamePlayers[Game.PLAYER_1], this.gamePlayers[Game.PLAYER_2]);
			return true;
		} else if (this.scoreboard[Game.PLAYER_2] >= Game.WINNING_SCORE) {
			this.gameEndedWithVictory(this.gamePlayers[Game.PLAYER_2], this.gamePlayers[Game.PLAYER_1]);
			return true;
		} else if ((this.scoreboard[Game.PLAYER_1] + this.scoreboard[Game.PLAYER_2]) == Game.MAX_POINTS) {
			this.sendMessageDraw();
			return true;
		}
		return false;
	}

	private gameEndedWithWO(winner: GamePlayer){
		this.sendMessageToPlayer(winner, 'GAME_PLAYER_WIN');

		winner == this.gamePlayers[Game.PLAYER_1] ? this.scoreboard[Game.PLAYER_1] = 3 : this.scoreboard[Game.PLAYER_2] = 3;

		this.gameEnd();
	}

	private gameEndedWithVictory(winner: GamePlayer, loser: GamePlayer) {

		this.sendMessageToPlayer(winner, 'GAME_PLAYER_WIN')
		this.sendMessageToPlayer(loser, 'GAME_PLAYER_LOSE')

	}

	private gameEndedInADraw() {

		this.broadcast('GAME_PLAYER_DRAW');
	}

	private sendMessageDraw() {
		this.broadcast('GAME_PLAYER_DRAW');
	}

	private sendMessageGameCountdown(second: number) {
		this.broadcast('GAME_COUNT_DOWN', second);
	}

	private remover(){

	let a = {
			id: this.id,
			field_width: Field.WIDTH,
			field_height: Field.HEIGHT,
			paddle_height: Paddle.HEIGHT,
			paddle_width: Paddle.WIDTH,
			paddle_player_1_height_position: this.players[0].y,
			paddle_player_1_width_position: this.players[0].x,
			paddle_player_2_height_position: this.players[1].y,
			paddle_player_2_width_position: this.players[1].x,
			ball_size: Ball.BALL_SIZE,
			ball_height_position: this.ball.y,
			ball_width_position: this.ball.x,
			scoreboard_player_1: this.scoreboard[Game.PLAYER_1],
			scoreboard_player_2: this.scoreboard[Game.PLAYER_2]
		}
	}

	private sendMessageGameFull() {
		this.broadcast('GAME_FULL', {
			id: this.id,
			field_width: Field.WIDTH,
			field_height: Field.HEIGHT,
			paddle_height: Paddle.HEIGHT,
			paddle_width: Paddle.WIDTH,
			paddle_player_1_height_position: this.players[0].y,
			paddle_player_1_width_position: this.players[0].x,
			paddle_player_2_height_position: this.players[1].y,
			paddle_player_2_width_position: this.players[1].x,
			ball_size: Ball.BALL_SIZE,
			ball_height_position: this.ball.y,
			ball_width_position: this.ball.x,
			scoreboard_player_1: this.scoreboard[Game.PLAYER_1],
			scoreboard_player_2: this.scoreboard[Game.PLAYER_2]
		});
	}

	private sendMessageGameCanStart(): void {
		this.broadcast('GAME_CAN_START');
	}

	private sendMessageGameStatus() {
		this.broadcast('GAME_STATUS', {
			paddle_player_1_height_position: this.players[0].y,
			paddle_player_2_height_position: this.players[1].y,
			ball_height_position: this.ball.y,
			ball_width_position: this.ball.x,
			scoreboard_player_1: this.scoreboard[Game.PLAYER_1],
			scoreboard_player_2: this.scoreboard[Game.PLAYER_2]
		});
	}

	private broadcast(messageType: MessageType, obj?: Object) {
		this.sendMessageToPlayer(this.gamePlayers[Game.PLAYER_1], messageType, obj);
		this.sendMessageToPlayer(this.gamePlayers[Game.PLAYER_2], messageType, obj);
	}

	private sendMessageToPlayer(player: GamePlayer, messageType: MessageType, obj?: Object) {

		if (this.gameStatus === 'FINISHED') return;

		if (!player.isOnline) return;

		let sender = new Sender(player.webSocketUserSession.getWebsocket);

		let messageToSend = (obj === undefined)
			? new Message(messageType)
			: new MessageWithValue(messageType, obj);

		sender.sendMessage(messageToSend);
	}

	public abstract playerMakePoint(player: GamePlayer): void;

	public abstract gameEnd(): void;
}
