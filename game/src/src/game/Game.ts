import { Ball } from "./Ball";
import { Field } from "./Field";
import { Paddle } from "./Paddle";
import { Player } from "./Player";
import { Message, MessageType } from "../message/Message";
import { MessageWithValue } from "../message/MessageWithValue";
import { WebSocketUserSession } from "../WebSocketUserSession";
import { Sender } from "../Sender";

export type GameStatus2 = 'NOT_READY' | 'READY' | 'RUNNING' | 'FINISHED';

export class Game {

	public static readonly MAX_POINTS = 10;
	public static readonly WINNING_SCORE = (this.MAX_POINTS / 2) + 1;
	private static matchIdCounter: number = 1;
	private static readonly START_COUNT_DOWN_VALUE = 3;


	private userSessions: WebSocketUserSession[] = [];
	private players: Player[] = [];
	private ball: Ball;

	private gameStatus: GameStatus2;

	private id: number = 0;

	private confirmed: Set<WebSocketUserSession>;

	private gameLoopInterval: NodeJS.Timeout | undefined;
	private countDownInterval: NodeJS.Timeout | undefined;

	private countDown = Game.START_COUNT_DOWN_VALUE;

	private keys = {
		paddle_left_up: false,
		paddle_left_down: false,
		paddle_right_up: false,
		paddle_right_down: false
	};

	constructor() {
		this.ball = new Ball(Field.WIDTH / 2, Field.HEIGHT / 2);
		this.players[0] = new Player(Paddle.SPACE_FROM_SIDE, Field.HEIGHT / 2 - Paddle.HEIGHT / 2, 0, 0);
		this.players[1] = new Player(Field.WIDTH - Paddle.SPACE_FROM_SIDE - Paddle.WIDTH, Field.HEIGHT / 2 - Paddle.HEIGHT / 2, 0, 0);

		this.gameStatus = 'NOT_READY';

		this.id = Game.matchIdCounter++;
		this.confirmed = new Set<WebSocketUserSession>();

		this.gameLoopInterval = undefined;
		this.countDownInterval = undefined;
	}

	public createMatch(player1: WebSocketUserSession, player2: WebSocketUserSession) {
		this.userSessions[0] = player1;
		this.userSessions[1] = player2;

		this.sendMessageGameCanStart();
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

	public movePaddle(player: WebSocketUserSession, paddleDirection: MessageType) {

		if (this.gameStatus !== 'RUNNING') return;

		if (player === this.userSessions[0]) {
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
		else if (player === this.userSessions[1]) {
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

	public abort() {
		if (this.gameStatus !== 'RUNNING') return;
		this.broadcast('GAME_ABORTED');
		this.stop();
	}


	public playerExit(wsSession: WebSocketUserSession) {

		let playerSession = (wsSession === this.userSessions[0]) ? this.players[0] : this.players[1];
		this.broadcast('GAME_ABORTED');
		this.stop();
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
			this.players[1].score++;
			this.checkIfAnyPlayerWon();
			this.resetBall();
		} else if (this.ball.x > Field.WIDTH) {
			this.players[0].score++;
			this.checkIfAnyPlayerWon();
			this.resetBall();
		}
	}

	// Check collision with a paddle
	private checkPaddleCollision(player: Player, isLeftPaddle: boolean) {

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

	// Update the scoreboard
	private checkIfAnyPlayerWon() {

		// Check if someone won
		if (this.players[0].score >= Game.WINNING_SCORE) {
			this.gameStatus = 'FINISHED';
			this.sendMessageToWinner(this.players[0]);
			this.stop();
		} else if (this.players[1].score >= Game.WINNING_SCORE) {
			this.gameStatus = 'FINISHED';
			this.sendMessageToWinner(this.players[1]);
			this.stop();
		} else if ((this.players[0].score + this.players[1].score) == Game.MAX_POINTS) {
			this.gameStatus = 'FINISHED';
			this.sendMessageDraw();
			this.stop();
		}

	}

	//------------------------------ messages --------------------------------------

	private sendMessageToWinner(player: Player) {
		if (player == this.players[0]) {
			this.sendMessageToPlayer(this.userSessions[0], 'GAME_PLAYER_WIN')
			this.sendMessageToPlayer(this.userSessions[1], 'GAME_PLAYER_LOSE')
		} else if (player == this.players[1]) {
			this.sendMessageToPlayer(this.userSessions[0], 'GAME_PLAYER_LOSE')
			this.sendMessageToPlayer(this.userSessions[1], 'GAME_PLAYER_WIN')
		}
	}

	private sendMessageDraw() {
		this.broadcast('GAME_PLAYER_DRAW');
	}


	private sendMessageGameCountdown(second: number) {
		this.broadcast('GAME_COUNT_DOWN', second);
	}

	private sendMessageGameFull() {
		this.broadcast('GAME_FULL', {
			"id": this.id,
			"sizes": {
				"field": {
					"width": Field.WIDTH,
					"height": Field.HEIGHT
				},
				"paddles": {
					"width": Paddle.WIDTH,
					"height": Paddle.HEIGHT
				},
				"ball": Ball.BALL_SIZE,
				"player_info": {
					"player_1": {
						"nome": "jonh"
					},
					"player_2": {
						"nome": "mary"
					}
				}
			},
			"positions": {
				"paddles": {
					"player_1": {
						"x": this.players[0].x,
						"y": this.players[0].y
					},
					"player_2": {
						"x": this.players[1].x,
						"y": this.players[1].y
					}
				},
				"ball": {
					"x": this.ball.x,
					"y": this.ball.y
				}
			},
			"scoreboard": {
				"player_1": this.players[0].score,
				"player_2": this.players[1].score
			}
		});
	}

	private sendMessageGameCanStart(): void {
		this.broadcast('GAME_CAN_START');
	}

	private sendMessageGameStatus() {
		this.broadcast('GAME_STATUS', {
			"positions": {
				"paddles": {
					"player_1": {
						"x": this.players[0].x,
						"y": this.players[0].y
					},
					"player_2": {
						"x": this.players[1].x,
						"y": this.players[1].y
					}
				},
				"ball": {
					"x": this.ball.x,
					"y": this.ball.y
				}
			},
			"scoreboard": {
				"player_1": this.players[0].score,
				"player_2": this.players[1].score
			}
		});
	}

	private broadcast(messageType: MessageType, obj?: Object) {
		this.sendMessageToPlayer(this.userSessions[0], messageType, obj);
		this.sendMessageToPlayer(this.userSessions[1], messageType, obj);
	}

	private sendMessageToPlayer(player: WebSocketUserSession, messageType: MessageType, obj?: Object) {
		let sender = new Sender(player.getWebsocket);

		let messageToSend = (obj === undefined)
			? new Message(messageType)
			: new MessageWithValue(messageType, obj);

		sender.sendMessage(messageToSend);
	}
}
