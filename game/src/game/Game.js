import { Ball } from "./Ball.js";
import { Field } from "./Field.js";
import { Paddle } from "./Paddle.js";
import { Message } from "../message/Message.js";
import { MessageWithValue } from "../message/MessageWithValue.js";
import { Sender } from "../Sender.js";
import { SaveRating } from "./SaveRating.js";
import { GameScoreboard } from "./GameScoreboard.js";
import { TournamentPlayer } from "../tournament/TournamentPlayer.js";
export class Game {
    static PLAYER_1 = 0;
    static PLAYER_2 = 1;
    static MAX_POINTS = 10;
    static WINNING_SCORE = (this.MAX_POINTS / 2) + 1;
    static matchIdCounter = 1;
    static START_COUNT_DOWN_VALUE = 3;
    gamePlayers;
    players = [];
    scoreboard = [0, 0];
    ball;
    gameStatus;
    gamePlayersStatus;
    id = 0;
    confirmed;
    gameLoopInterval;
    countDownInterval;
    countDown = Game.START_COUNT_DOWN_VALUE;
    saveRating;
    keys = {
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
        this.confirmed = new Set();
        this.gameLoopInterval = undefined;
        this.countDownInterval = undefined;
        this.saveRating = new SaveRating();
    }
    createMatch(player1, player2) {
        this.gamePlayers[Game.PLAYER_1] = player1;
        this.gamePlayers[Game.PLAYER_2] = player2;
        if (!player1.isOnline) {
            this.gameEndedWithWO(player2);
        }
        else if (!player2.isOnline) {
            this.gameEndedWithWO(player1);
        }
        else {
            this.sendMessageGameCanStart();
        }
    }
    addConfirmation(wsSession) {
        this.confirmed.add(wsSession);
        return this.confirmed.size;
    }
    startGame() {
        this.gameStatus = 'READY';
        this.sendMessageGameFull();
        this.makeCountDownRoutine();
    }
    movePaddle(player, paddleDirection) {
        if (this.gameStatus !== 'RUNNING')
            return;
        if (player.webSocketUserSession.getId === this.gamePlayers[Game.PLAYER_1].webSocketUserSession.getId) {
            if (paddleDirection === 'GAME_PADDLE_UP_KEYDOWN') {
                this.keys.paddle_left_up = true;
            }
            else if (paddleDirection === 'GAME_PADDLE_UP_KEYUP') {
                this.keys.paddle_left_up = false;
            }
            else if (paddleDirection === 'GAME_PADDLE_DOWN_KEYDOWN') {
                this.keys.paddle_left_down = true;
            }
            else if (paddleDirection === 'GAME_PADDLE_DOWN_KEYUP') {
                this.keys.paddle_left_down = false;
            }
            this.updatePaddleSpeeds();
        }
        else if (player.webSocketUserSession.getId === this.gamePlayers[Game.PLAYER_2].webSocketUserSession.getId) {
            if (paddleDirection === 'GAME_PADDLE_UP_KEYDOWN') {
                this.keys.paddle_right_up = true;
            }
            else if (paddleDirection === 'GAME_PADDLE_UP_KEYUP') {
                this.keys.paddle_right_up = false;
            }
            else if (paddleDirection === 'GAME_PADDLE_DOWN_KEYDOWN') {
                this.keys.paddle_right_down = true;
            }
            else if (paddleDirection === 'GAME_PADDLE_DOWN_KEYUP') {
                this.keys.paddle_right_down = false;
            }
            this.updatePaddleSpeeds();
        }
    }
    // 'NOT_READY' | 'READY' | 'RUNNING' | 'FINISHED';
    abort() {
        if (this.gameStatus === 'FINISHED')
            return;
        this.broadcast('GAME_ABORTED');
        this.gameEnd();
        this.stop();
    }
    playerExit(playerDisconnected) {
        if (this.gameStatus !== 'RUNNING') {
            this.abort();
        }
        if (playerDisconnected.webSocketUserSession.getId === this.gamePlayers[Game.PLAYER_1].webSocketUserSession.getId) {
            this.gamePlayersStatus = 'PLAYER_1_DISCONNECTED';
        }
        else if (playerDisconnected.webSocketUserSession.getId === this.gamePlayers[Game.PLAYER_2].webSocketUserSession.getId) {
            this.gamePlayersStatus = 'PLAYER_2_DISCONNECTED';
        }
    }
    get getId() {
        return this.id;
    }
    makeCountDownRoutine() {
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
    stopCountDownRoutine() {
        if (this.countDownInterval) {
            clearInterval(this.countDownInterval);
            this.countDownInterval = undefined;
        }
    }
    stopGameLoopRoutine() {
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = undefined;
        }
    }
    // --------------------------- end stop routines ---------------------------
    stop() {
        this.gameStatus = 'FINISHED';
        this.stopCountDownRoutine();
        this.stopGameLoopRoutine();
    }
    // Updates the paddles speeds
    updatePaddleSpeeds() {
        this.players[0].speed = 0;
        if (this.keys.paddle_left_up)
            this.players[0].speed = -Paddle.SPEED;
        if (this.keys.paddle_left_down)
            this.players[0].speed = Paddle.SPEED;
        this.players[1].speed = 0;
        if (this.keys.paddle_right_up)
            this.players[1].speed = -Paddle.SPEED;
        if (this.keys.paddle_right_down)
            this.players[1].speed = Paddle.SPEED;
    }
    gameLoopRoutine() {
        this.gameStatus = 'RUNNING';
        this.gameLoopInterval = setInterval(() => {
            if (this.gameStatus === 'RUNNING') {
                this.update();
                this.sendMessageGameStatus();
            }
        }, 15);
    }
    // Updates the game state
    update() {
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
        }
        else if (this.ball.x > Field.WIDTH) {
            this.scoreboard[Game.PLAYER_1]++;
            this.playerMakePoint(this.gamePlayers[Game.PLAYER_1]);
            this.resetBall();
            this.sendMessageGameStatus();
        }
        if (this.checkIfAnyPlayerWon() || this.checkIfAPlayerHasDisconnected()) {
            let player1 = new TournamentPlayer(true, this.gamePlayers[Game.PLAYER_1].webSocketUserSession);
            let player2 = new TournamentPlayer(true, this.gamePlayers[Game.PLAYER_2].webSocketUserSession);
            let gameScoreboard = new GameScoreboard(player1, player2);
            gameScoreboard.playerMakePoint(player1, this.scoreboard[Game.PLAYER_1]);
            gameScoreboard.playerMakePoint(player1, this.scoreboard[Game.PLAYER_2]);
            this.saveRating.saveRating(gameScoreboard);
            this.gameEnd();
            this.stop();
        }
    }
    // Check collision with a paddle
    checkPaddleCollision(player, isLeftPaddle) {
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
            }
            else {
                this.ball.x = player.x - Ball.BALL_SIZE;
            }
            return true;
        }
        return false;
    }
    // Reset the ball in the center
    resetBall() {
        this.ball.x = Field.WIDTH / 2;
        this.ball.y = Math.floor(Math.random() * ((Field.HEIGHT - 20) - 20 + 1)) + 20;
        // Random direction (but always towards the player who lost the point)
        this.ball.speedX = this.ball.speedX > 0 ? Ball.INITIAL_BALL_SPEED : -Ball.INITIAL_BALL_SPEED;
        this.ball.speedY = (Math.random() * Ball.INITIAL_BALL_SPEED * 2) - Ball.INITIAL_BALL_SPEED;
    }
    checkIfAPlayerHasDisconnected() {
        // check by player disconnect
        if (this.gamePlayersStatus === 'PLAYER_1_DISCONNECTED') {
            if (this.scoreboard[Game.PLAYER_2] < this.scoreboard[Game.PLAYER_1]) {
                this.gameEndedInADraw();
            }
            else {
                this.gameEndedWithVictory(this.gamePlayers[Game.PLAYER_2], this.gamePlayers[Game.PLAYER_1]);
            }
            return true;
        }
        else if (this.gamePlayersStatus === 'PLAYER_2_DISCONNECTED') {
            if (this.scoreboard[Game.PLAYER_1] < this.scoreboard[Game.PLAYER_2]) {
                this.gameEndedInADraw();
            }
            else {
                this.gameEndedWithVictory(this.gamePlayers[Game.PLAYER_1], this.gamePlayers[Game.PLAYER_2]);
            }
            return true;
        }
        return false;
    }
    // Update the scoreboard
    checkIfAnyPlayerWon() {
        // Check if someone won
        if (this.scoreboard[Game.PLAYER_1] >= Game.WINNING_SCORE) {
            this.gameEndedWithVictory(this.gamePlayers[Game.PLAYER_1], this.gamePlayers[Game.PLAYER_2]);
            return true;
        }
        else if (this.scoreboard[Game.PLAYER_2] >= Game.WINNING_SCORE) {
            this.gameEndedWithVictory(this.gamePlayers[Game.PLAYER_2], this.gamePlayers[Game.PLAYER_1]);
            return true;
        }
        else if ((this.scoreboard[Game.PLAYER_1] + this.scoreboard[Game.PLAYER_2]) == Game.MAX_POINTS) {
            this.sendMessageDraw();
            return true;
        }
        return false;
    }
    gameEndedWithWO(winner) {
        this.sendMessageToPlayer(winner, 'GAME_PLAYER_WIN');
        winner == this.gamePlayers[Game.PLAYER_1] ? this.scoreboard[Game.PLAYER_1] = 3 : this.scoreboard[Game.PLAYER_2] = 3;
        this.gameEnd();
    }
    gameEndedWithVictory(winner, loser) {
        this.sendMessageToPlayer(winner, 'GAME_PLAYER_WIN');
        this.sendMessageToPlayer(loser, 'GAME_PLAYER_LOSE');
    }
    gameEndedInADraw() {
        this.broadcast('GAME_PLAYER_DRAW');
    }
    sendMessageDraw() {
        this.broadcast('GAME_PLAYER_DRAW');
    }
    sendMessageGameCountdown(second) {
        this.broadcast('GAME_COUNT_DOWN', second);
    }
    sendMessageGameFull() {
        this.broadcast('GAME_FULL', {
            id: this.id,
            userId1: this.gamePlayers[Game.PLAYER_1].webSocketUserSession.getUserId,
            userId2: this.gamePlayers[Game.PLAYER_2].webSocketUserSession.getUserId,
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
    sendMessageGameCanStart() {
        this.broadcast('GAME_CAN_START');
    }
    sendMessageGameStatus() {
        this.broadcast('GAME_STATUS', {
            paddle_player_1_height_position: this.players[0].y,
            paddle_player_2_height_position: this.players[1].y,
            ball_height_position: this.ball.y,
            ball_width_position: this.ball.x,
            scoreboard_player_1: this.scoreboard[Game.PLAYER_1],
            scoreboard_player_2: this.scoreboard[Game.PLAYER_2]
        });
    }
    broadcast(messageType, obj) {
        this.sendMessageToPlayer(this.gamePlayers[Game.PLAYER_1], messageType, obj);
        this.sendMessageToPlayer(this.gamePlayers[Game.PLAYER_2], messageType, obj);
    }
    sendMessageToPlayer(player, messageType, obj) {
        if (this.gameStatus === 'FINISHED')
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
