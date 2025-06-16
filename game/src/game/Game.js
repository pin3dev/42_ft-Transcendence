"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const Ball_1 = require("./Ball");
const Field_1 = require("./Field");
const Paddle_1 = require("./Paddle");
const Message_1 = require("../message/Message");
const MessageWithValue_1 = require("../message/MessageWithValue");
const Sender_1 = require("../Sender");
const SaveRating_1 = require("./SaveRating");
const GameScoreboard_1 = require("./GameScoreboard");
const TournamentPlayer_1 = require("../tournament/TournamentPlayer");
const MatchSaveStrategy_1 = require("../persistence/MatchSaveStrategy");
const GameAPISingleton_1 = require("../GameAPISingleton");
class Game {
    constructor(tournamentId) {
        this.players = [];
        this.scoreboard = [0, 0];
        this.id = 0;
        this.countDown = _a.START_COUNT_DOWN_VALUE;
        this.startedAt = new Date();
        this.endedAt = new Date();
        this.keys = {
            paddle_left_up: false,
            paddle_left_down: false,
            paddle_right_up: false,
            paddle_right_down: false
        };
        this.gamePlayers = [];
        this.players[0] = new Paddle_1.Paddle(Paddle_1.Paddle.SPACE_FROM_SIDE, Field_1.Field.HEIGHT / 2 - Paddle_1.Paddle.HEIGHT / 2, 0);
        this.players[1] = new Paddle_1.Paddle(Field_1.Field.WIDTH - Paddle_1.Paddle.SPACE_FROM_SIDE - Paddle_1.Paddle.WIDTH, Field_1.Field.HEIGHT / 2 - Paddle_1.Paddle.HEIGHT / 2, 0);
        this.ball = new Ball_1.Ball(Field_1.Field.WIDTH / 2, Field_1.Field.HEIGHT / 2);
        this.gameStatus = 'NOT_READY';
        this.gamePlayersStatus = 'ON_LINE';
        this.id = _a.matchIdCounter++;
        this.confirmed = new Set();
        this.gameLoopInterval = undefined;
        this.countDownInterval = undefined;
        this.saveRating = new SaveRating_1.SaveRating();
        this.matchSaveStrategy = new MatchSaveStrategy_1.MatchSaveStrategy(GameAPISingleton_1.GameAPISingleton.getTypeOfEnvironment());
        this._tournamentId = tournamentId;
    }
    createMatch(player1, player2) {
        this.gamePlayers[_a.PLAYER_1] = player1;
        this.gamePlayers[_a.PLAYER_2] = player2;
        this.startedAt = new Date();
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
    getPlayer1Id() {
        return this.gamePlayers[_a.PLAYER_1].webSocketUserSession.getUserId;
    }
    getPlayer2Id() {
        return this.gamePlayers[_a.PLAYER_2].webSocketUserSession.getUserId;
    }
    getWinnerId() {
        if (this.scoreboard[_a.PLAYER_1] > this.scoreboard[_a.PLAYER_2]) {
            return this.gamePlayers[_a.PLAYER_1].webSocketUserSession.getUserId;
        }
        else if (this.scoreboard[_a.PLAYER_2] > this.scoreboard[_a.PLAYER_1]) {
            return this.gamePlayers[_a.PLAYER_2].webSocketUserSession.getUserId;
        }
        return null;
    }
    getScore() {
        return this.scoreboard[_a.PLAYER_1] + '-' + this.scoreboard[_a.PLAYER_2];
    }
    getStartedAt() {
        return this.startedAt;
    }
    getEndedAt() {
        return this.endedAt;
    }
    getWhoWin() {
        if (this.scoreboard[_a.PLAYER_1] > this.scoreboard[_a.PLAYER_2]) {
            return -1;
        }
        else if (this.scoreboard[_a.PLAYER_2] > this.scoreboard[_a.PLAYER_1]) {
            return 1;
        }
        return 0;
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
    getTournamentId() {
        return this._tournamentId;
    }
    movePaddle(player, paddleDirection) {
        if (this.gameStatus !== 'RUNNING')
            return;
        if (player.webSocketUserSession.getId === this.gamePlayers[_a.PLAYER_1].webSocketUserSession.getId) {
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
        else if (player.webSocketUserSession.getId === this.gamePlayers[_a.PLAYER_2].webSocketUserSession.getId) {
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
    abort() {
        if (this.gameStatus === 'FINISHED')
            return;
        this.broadcast('GAME_ABORTED');
        this.stop();
    }
    playerExit(playerDisconnected) {
        if (this.gameStatus !== 'RUNNING') {
            this.abort();
        }
        if (playerDisconnected.webSocketUserSession.getId === this.gamePlayers[_a.PLAYER_1].webSocketUserSession.getId) {
            this.gamePlayersStatus = 'PLAYER_1_DISCONNECTED';
        }
        else if (playerDisconnected.webSocketUserSession.getId === this.gamePlayers[_a.PLAYER_2].webSocketUserSession.getId) {
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
    stop() {
        this.endedAt = new Date();
        this.stopCountDownRoutine();
        this.stopGameLoopRoutine();
        this.gameStatus = 'FINISHED';
        this.gameEnd();
    }
    updatePaddleSpeeds() {
        this.players[0].speed = 0;
        if (this.keys.paddle_left_up)
            this.players[0].speed = -Paddle_1.Paddle.SPEED;
        if (this.keys.paddle_left_down)
            this.players[0].speed = Paddle_1.Paddle.SPEED;
        this.players[1].speed = 0;
        if (this.keys.paddle_right_up)
            this.players[1].speed = -Paddle_1.Paddle.SPEED;
        if (this.keys.paddle_right_down)
            this.players[1].speed = Paddle_1.Paddle.SPEED;
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
    update() {
        this.players[0].y = this.players[0].y + this.players[0].speed;
        this.players[1].y = this.players[1].y + this.players[1].speed;
        this.players[0].y = Math.max(0, Math.min(Field_1.Field.HEIGHT - Paddle_1.Paddle.HEIGHT, this.players[0].y));
        this.players[1].y = Math.max(0, Math.min(Field_1.Field.HEIGHT - Paddle_1.Paddle.HEIGHT, this.players[1].y));
        this.ball.x = this.ball.x + this.ball.speedX;
        this.ball.y = this.ball.y + this.ball.speedY;
        if (this.ball.y <= 0 || this.ball.y >= Field_1.Field.HEIGHT - Ball_1.Ball.BALL_SIZE) {
            this.ball.speedY = this.ball.speedY * -1;
        }
        if (this.checkPaddleCollision(this.players[0], true) || this.checkPaddleCollision(this.players[1], false)) {
            const speedIncrease = 0.2;
            const maxSpeed = 10;
            this.ball.speedX = Math.sign(this.ball.speedX) * Math.min(Math.abs(this.ball.speedX) + speedIncrease, maxSpeed);
        }
        if (this.ball.x < 0) {
            this.scoreboard[_a.PLAYER_2]++;
            this.playerMakePoint(this.gamePlayers[_a.PLAYER_2]);
            this.resetBall();
            this.sendMessageGameStatus();
        }
        else if (this.ball.x > Field_1.Field.WIDTH) {
            this.scoreboard[_a.PLAYER_1]++;
            this.playerMakePoint(this.gamePlayers[_a.PLAYER_1]);
            this.resetBall();
            this.sendMessageGameStatus();
        }
        if (this.checkIfAnyPlayerWon() || this.checkIfAPlayerHasDisconnected()) {
            let player1 = new TournamentPlayer_1.TournamentPlayer(true, this.gamePlayers[_a.PLAYER_1].webSocketUserSession);
            let player2 = new TournamentPlayer_1.TournamentPlayer(true, this.gamePlayers[_a.PLAYER_2].webSocketUserSession);
            let gameScoreboard = new GameScoreboard_1.GameScoreboard(player1, player2);
            gameScoreboard.playerMakePoint(player1, this.scoreboard[_a.PLAYER_1]);
            gameScoreboard.playerMakePoint(player1, this.scoreboard[_a.PLAYER_2]);
            this.saveRating.saveRating(gameScoreboard);
            this.endedAt = new Date();
            this.matchSaveStrategy.save(this);
            this.stop();
        }
    }
    checkPaddleCollision(player, isLeftPaddle) {
        const paddleRight = player.x + Paddle_1.Paddle.WIDTH;
        const paddleBottom = player.y + Paddle_1.Paddle.HEIGHT;
        const ballRight = this.ball.x + Ball_1.Ball.BALL_SIZE;
        const ballBottom = this.ball.y + Ball_1.Ball.BALL_SIZE;
        if (ballRight > player.x && this.ball.x < paddleRight &&
            ballBottom > player.y && this.ball.y < paddleBottom) {
            const hitPosition = (this.ball.y + Ball_1.Ball.BALL_SIZE / 2 - (player.y + Paddle_1.Paddle.HEIGHT / 2)) / (Paddle_1.Paddle.HEIGHT / 2);
            this.ball.speedX = -this.ball.speedX * 1.05;
            this.ball.speedY = hitPosition * Math.abs(this.ball.speedX);
            if (isLeftPaddle) {
                this.ball.x = paddleRight;
            }
            else {
                this.ball.x = player.x - Ball_1.Ball.BALL_SIZE;
            }
            return true;
        }
        return false;
    }
    resetBall() {
        this.ball.x = Field_1.Field.WIDTH / 2;
        this.ball.y = Math.floor(Math.random() * ((Field_1.Field.HEIGHT - 20) - 20 + 1)) + 20;
        this.ball.speedX = this.ball.speedX > 0 ? Ball_1.Ball.INITIAL_BALL_SPEED : -Ball_1.Ball.INITIAL_BALL_SPEED;
        this.ball.speedY = (Math.random() * Ball_1.Ball.INITIAL_BALL_SPEED * 2) - Ball_1.Ball.INITIAL_BALL_SPEED;
    }
    checkIfAPlayerHasDisconnected() {
        if (this.gamePlayersStatus === 'PLAYER_1_DISCONNECTED') {
            if (this.scoreboard[_a.PLAYER_2] < this.scoreboard[_a.PLAYER_1]) {
                this.sendMessageDraw();
            }
            else {
                this.gameEndedWithVictory(this.gamePlayers[_a.PLAYER_2], this.gamePlayers[_a.PLAYER_1]);
            }
            return true;
        }
        else if (this.gamePlayersStatus === 'PLAYER_2_DISCONNECTED') {
            if (this.scoreboard[_a.PLAYER_1] < this.scoreboard[_a.PLAYER_2]) {
                this.sendMessageDraw();
            }
            else {
                this.gameEndedWithVictory(this.gamePlayers[_a.PLAYER_1], this.gamePlayers[_a.PLAYER_2]);
            }
            return true;
        }
        return false;
    }
    checkIfAnyPlayerWon() {
        if (this.scoreboard[_a.PLAYER_1] >= _a.WINNING_SCORE) {
            this.gameEndedWithVictory(this.gamePlayers[_a.PLAYER_1], this.gamePlayers[_a.PLAYER_2]);
            return true;
        }
        else if (this.scoreboard[_a.PLAYER_2] >= _a.WINNING_SCORE) {
            this.gameEndedWithVictory(this.gamePlayers[_a.PLAYER_2], this.gamePlayers[_a.PLAYER_1]);
            return true;
        }
        else if ((this.scoreboard[_a.PLAYER_1] + this.scoreboard[_a.PLAYER_2]) == _a.MAX_POINTS) {
            this.sendMessageDraw();
            return true;
        }
        return false;
    }
    gameEndedWithWO(winner) {
        this.sendMessageToPlayer(winner, 'GAME_PLAYER_WIN');
        let theWinner = winner.webSocketUserSession.getUserId === this.gamePlayers[_a.PLAYER_1].webSocketUserSession.getUserId ? this.gamePlayers[_a.PLAYER_1] : this.gamePlayers[_a.PLAYER_2];
        this.playerMakePoint(theWinner);
        this.playerMakePoint(theWinner);
        this.playerMakePoint(theWinner);
        this.stop();
    }
    gameEndedWithVictory(winner, loser) {
        this.sendMessageToPlayer(winner, 'GAME_PLAYER_WIN');
        this.sendMessageToPlayer(loser, 'GAME_PLAYER_LOSE');
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
            userId1: this.gamePlayers[_a.PLAYER_1].webSocketUserSession.getUserId,
            userId2: this.gamePlayers[_a.PLAYER_2].webSocketUserSession.getUserId,
            field_width: Field_1.Field.WIDTH,
            field_height: Field_1.Field.HEIGHT,
            paddle_height: Paddle_1.Paddle.HEIGHT,
            paddle_width: Paddle_1.Paddle.WIDTH,
            paddle_player_1_height_position: this.players[0].y,
            paddle_player_1_width_position: this.players[0].x,
            paddle_player_2_height_position: this.players[1].y,
            paddle_player_2_width_position: this.players[1].x,
            ball_size: Ball_1.Ball.BALL_SIZE,
            ball_height_position: this.ball.y,
            ball_width_position: this.ball.x,
            scoreboard_player_1: this.scoreboard[_a.PLAYER_1],
            scoreboard_player_2: this.scoreboard[_a.PLAYER_2]
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
            scoreboard_player_1: this.scoreboard[_a.PLAYER_1],
            scoreboard_player_2: this.scoreboard[_a.PLAYER_2]
        });
    }
    broadcast(messageType, obj) {
        this.sendMessageToPlayer(this.gamePlayers[_a.PLAYER_1], messageType, obj);
        this.sendMessageToPlayer(this.gamePlayers[_a.PLAYER_2], messageType, obj);
    }
    sendMessageToPlayer(player, messageType, obj) {
        if (this.gameStatus === 'FINISHED')
            return;
        if (!player.isOnline)
            return;
        let sender = new Sender_1.Sender(player.webSocketUserSession.getWebsocket);
        let messageToSend = (obj === undefined)
            ? new Message_1.Message(messageType)
            : new MessageWithValue_1.MessageWithValue(messageType, obj);
        sender.sendMessage(messageToSend);
    }
}
exports.Game = Game;
_a = Game;
Game.PLAYER_1 = 0;
Game.PLAYER_2 = 1;
Game.MAX_POINTS = 10;
Game.WINNING_SCORE = (_a.MAX_POINTS / 2) + 1;
Game.matchIdCounter = 1;
Game.START_COUNT_DOWN_VALUE = 3;
