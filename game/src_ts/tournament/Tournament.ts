import { Game } from "../game/Game";
import { GameScoreboard } from "../game/GameScoreboard";
import { GameHandlerAPI } from "../handlers/GameHandlerAPI";
import { Message, MessageType } from "../message/Message";
import { MessageWithValue } from "../message/MessageWithValue";
import { Sender } from "../Sender";
import { WebSocketUserSession } from "../WebSocketUserSession";
import { WebSocketUserSessionListener } from "../WebSocketUserSessionListener";
import { GameTournament } from "./GameTournament";
import { GameTournamentListener } from "./GameTournamentListener";
import { MakeRounds } from "./MakeRounds";
import { OverallScoreboardOfTheRound } from "./OverallScoreboardOfTheRound";
import { TableOfPoints } from "./TableOfPoints";
import { TournamentPlayer } from "./TournamentPlayer";

export enum TournamentStatus {
	WAITING_PLAYERS,
	READY,
	RUNNING,
	FINISHED
}

export enum RoundStatus {
	COUNT_DOWN,
	WAITING_COUNTDOWN,
	CREATE_ROUND,
	ROUND_GOING_ON,
	ROUNDS_ENDED
}

export class Tournament implements GameTournamentListener {

	public static readonly MAX_PLAYERS = 16;

	private _id = 1;

	private _numberOfPlayer: number = 0;

	private _tournamentPlayers: Map<WebSocketUserSession, TournamentPlayer>;
	private _gameHandlerAPI: GameHandlerAPI;
	private _idsOfGamesRound: number[];

	// overall tournament ranking
	private _tableOfPoints: TableOfPoints;

	// all round scores
	private _overallScoreboardOfTheRound: OverallScoreboardOfTheRound = new OverallScoreboardOfTheRound();

	private _tournamentStatus: TournamentStatus;

	// maximum number of rounds in the tournament
	private _roundCount: number;
	private _roundCountMaxRounds: number;

	// counter of the maximum number of games per round
	private _numberOfGamesCompletedInTheRound: number;
	private _numberOfGamesCompletedInTheRoundMaxPossible: number;

	//interval values
	private mainInterval: NodeJS.Timeout | undefined;
	private countDownInterval: NodeJS.Timeout | undefined;

	private _roundStatus: RoundStatus;

	private _countDown: number;

	private _makeRound: MakeRounds;

	constructor(numberOfPlayer: number, gameHandlerAPI: GameHandlerAPI) {

		this._numberOfPlayer = numberOfPlayer;
		this._gameHandlerAPI = gameHandlerAPI;

		this._idsOfGamesRound = [];

		this._tournamentPlayers = new Map<WebSocketUserSession, TournamentPlayer>();

		this._tableOfPoints = new TableOfPoints();

		this._tournamentStatus = TournamentStatus.WAITING_PLAYERS;

		this._roundCount = 0;
		this._roundCountMaxRounds = numberOfPlayer - 1;

		this._numberOfGamesCompletedInTheRound = 0;
		this._numberOfGamesCompletedInTheRoundMaxPossible = numberOfPlayer / 2;

		this._roundStatus = RoundStatus.COUNT_DOWN;

		this._countDown = 3;

		this._makeRound = new MakeRounds(null!);
	}

	/**
	 *
	 * @param webSocketUserSession
	 *
	 * @returns true if tournament is full and ready to running, if error or not full, false is returned
	 */
	public addPlayer(webSocketUserSession: WebSocketUserSession): boolean {

		const sender = new Sender(webSocketUserSession.getWebsocket);

		if (this._tournamentStatus === TournamentStatus.FINISHED) {
			sender.sendMessage(new Message('ERROR_TOURNAMENT_FINISHED'));
			return false;
		}

		if (this._tournamentStatus === TournamentStatus.RUNNING) {
			sender.sendMessage(new Message('ERROR_TOURNAMENT_IN_PROGRESS'));
			return false;
		}

		if (this._tournamentPlayers.size === this._numberOfPlayer) {
			sender.sendMessage(new Message('ERROR_TOURNARMENT_FULL'));
			return false;
		}

		// check if the websocket is not already in the tournament
		if (webSocketUserSession.getTournamentId === this._id) {
			sender.sendMessage(new Message('ERROR_TOURNAMENT_ALREADY_PARTICIPATING'));
			return false;
		}

		// check if the user is not already in the tournament
		for (let webSocketUserSessionAlreadyInTheTournament of this._tournamentPlayers.keys()) {
			if (webSocketUserSession.getUserId === webSocketUserSessionAlreadyInTheTournament.getUserId) {
				sender.sendMessage(new Message('ERROR_TOURNAMENT_ALREADY_PARTICIPATING'));
				return false;
			}
		}

		// add the id of this tournament in webSocketUserSession to make it easier
		// to search and know that the player's game is part of this tournament
		webSocketUserSession.setTournamentId = this._id;

		let tournamentPlayer: TournamentPlayer = new TournamentPlayer(true, webSocketUserSession);
		this._tournamentPlayers.set(webSocketUserSession, tournamentPlayer);
		this._tableOfPoints.addPlayer(tournamentPlayer);

		sender.sendMessage(new Message('TOURNAMENT_WAITING_PLAYER'));

		this.sendMessageTableOfPoints();

		if (this._tournamentPlayers.size === this._numberOfPlayer) {
			this._tournamentStatus = TournamentStatus.READY;
		}
		return (this._tournamentPlayers.size === this._numberOfPlayer);
	}

	public removePlayer(webSocketUserSession: WebSocketUserSession): void {

		webSocketUserSession.setTournamentId = 0;

		if (this._tournamentStatus === TournamentStatus.FINISHED) {
			return;
		}

		if (this._tournamentStatus === TournamentStatus.WAITING_PLAYERS) {

			let tournamentPlayer: TournamentPlayer | undefined = this._tournamentPlayers.get(webSocketUserSession);

			if (tournamentPlayer !== undefined) {
				this._tableOfPoints.removerPlayer(tournamentPlayer);
			}
			this._tournamentPlayers.delete(webSocketUserSession);

			if (this._tournamentPlayers.size === 0) {
				this._tournamentStatus = TournamentStatus.FINISHED;
			}
			return;
		}

		let tournamentPlayer: TournamentPlayer | undefined = this._tournamentPlayers.get(webSocketUserSession);
		if (tournamentPlayer !== undefined) {
			tournamentPlayer.isOnline = false;
		}

	}

	public start() {
		if (this._tournamentStatus !== TournamentStatus.READY) return;

		this._makeRound = new MakeRounds(Array.from(this._tournamentPlayers.values()));

		this._roundStatus = RoundStatus.COUNT_DOWN;
		this._tournamentStatus = TournamentStatus.RUNNING;
		this.tournamentLoop();
	}

	public getStatus(): TournamentStatus {
		return this._tournamentStatus;
	}

	//--- private methods ---

	private tournamentLoop() {
		this.mainInterval = setInterval(() => {

			switch (this._roundStatus) {
				case RoundStatus.COUNT_DOWN:
					this.sendCountDown();
					this._roundStatus = RoundStatus.WAITING_COUNTDOWN;
					break;
				case RoundStatus.CREATE_ROUND:
					this._roundStatus = RoundStatus.ROUND_GOING_ON;
					this.doRound();
					break;
				case RoundStatus.ROUND_GOING_ON:
					{
						if (this._roundCount === this._roundCountMaxRounds) {
							this._roundStatus = RoundStatus.ROUNDS_ENDED;
						} else if (this._numberOfGamesCompletedInTheRound === this._numberOfGamesCompletedInTheRoundMaxPossible) {
							this._roundStatus = RoundStatus.COUNT_DOWN;
							this._roundCount++;

						}
						break;
					}
				case RoundStatus.ROUNDS_ENDED:
					this.tournamentIsOver();
					this.stopTournamentLoop();
			}
		}, 10);
	}

	private stopCountDownRoutine() {
		if (this.countDownInterval) {
			clearInterval(this.countDownInterval);
			this.countDownInterval = undefined;
		}
	}

	private stopTournamentLoop() {
		if (this.mainInterval) {
			clearInterval(this.mainInterval);
			this.mainInterval = undefined;
		}
		this._tournamentStatus = TournamentStatus.FINISHED;
	}

	private sendCountDown() {
		this._countDown = 3;
		this.countDownInterval = setInterval(() => {
			this.broadcast('TOURNAMENT_COUNT_DOWN', this._countDown);
			this._countDown--;
			if (this._countDown < 0) {
				this.stopCountDownRoutine();
				this._roundStatus = RoundStatus.CREATE_ROUND;
			}
		}, 1000);
	}

	private tournamentIsOver(): void {

		const finalTableOfPointsSorted = this._tableOfPoints.getTableSorted();

		for (let playerTornament of finalTableOfPointsSorted) {
			this.sendMessagePlayerFinalPosition(playerTornament);

			//clear player values;
			playerTornament.webSocketUserSession.setGameId = 0;
			playerTornament.webSocketUserSession.setTournamentId = 0;
		}
	}

	private doRound(): void {

		// 1) countDeJogosDaRodada = 0;
		// 2) limpar mapa de jogos da rodada do torneio
		// 3) pegar uma rodada no mapa de jogos do torneio
		// 4) criar a lista de Gamescoreboard

		// 5) criar a table de jogos da rodada e enviar para todos jogadores
		// 6) enviar a tabela de pontos do torneio para todos os jogadores do torneio

		// 7) criar os games das partidas (remover o id antigo do game do jogador para nao dar bug e add o do novo jogo)
			// na hora de criar os games tournamentPlayer offline vs tournamenPlayer offline tem que incrementar o countador de jogos da rodada para nao ter bug de espera infinita
			// ter um contador da hora de criar o jogos, pois se todos os jogos forem null, temos que terminar o torneio, nao faz sentido ter jogadores fantasmas!

				//rest values to a new round
		/* 1 */	this._numberOfGamesCompletedInTheRound = 0;
		/* 2 */	for (const idOfGamesInTheRound of this._idsOfGamesRound) {
			this._gameHandlerAPI.removeGameToGlobalGameMap(idOfGamesInTheRound);
		}
		this._idsOfGamesRound = [];

		//get a new pairs of games to this round
		/* 3 */	let roundPairs: [TournamentPlayer, TournamentPlayer][] = this._makeRound.getARound();

		//create a new overall scoreboard to this round
		this._overallScoreboardOfTheRound = new OverallScoreboardOfTheRound();

		let arrayOfGamescoreboardToThisRound: GameScoreboard[] = [];

		for (const playersOfGame of roundPairs) {
			const gameScoreboard: GameScoreboard = new GameScoreboard(playersOfGame[0], playersOfGame[1]);
/* 4 */		arrayOfGamescoreboardToThisRound.push(gameScoreboard);
			this._overallScoreboardOfTheRound.addGameScoreboard(gameScoreboard);

		}

		/* 5 */		this.sendMessageOverallScoreboard();
		/* 6 */ 	this.sendMessageTableOfPoints();

		let isTheTournamentWithoutPlayers: boolean = true;

		/* 7 */ for (const gameboard of arrayOfGamescoreboardToThisRound) {


			// If both players are offline there is no reason to play,
			// we will count this match and continue
			if (!gameboard.player1.isOnline && !gameboard.player2.isOnline) {
				this.playEnded(gameboard);
				continue;
			}

			// variable to check if no players are online. If all players have left, no games will be created, so the tournament should stop
			isTheTournamentWithoutPlayers = false;

			let newGame: GameTournament = new GameTournament(gameboard, this, String(this._id));
			let gameId: number = newGame.getId;

			//add the new gameId for the players so that when they send the messages it doesn't give an invalid match
			gameboard.player1.webSocketUserSession.setGameId = gameId;
			gameboard.player2.webSocketUserSession.setGameId = gameId;

			this._gameHandlerAPI.addGameToGlobalGameMap(newGame, gameboard.player1, gameboard.player2);
			this._idsOfGamesRound.push(gameId);

			newGame.createMatch(gameboard.player1, gameboard.player2);
		}

		if (isTheTournamentWithoutPlayers) {
			this._roundStatus = RoundStatus.ROUNDS_ENDED;
		}
	}

	// ------------------- interfaces methods start -------------------

	playerMakePoint(gameScoreboard: GameScoreboard): void {
		this._overallScoreboardOfTheRound.addGameScoreboard(gameScoreboard);
		this.sendMessageOverallScoreboard();
	}

	playEnded(gameScoreboard: GameScoreboard): void {

		//change gameScoreboard status
		this._tableOfPoints.addPlayerScore(gameScoreboard);
		this._numberOfGamesCompletedInTheRound++;
	}

	// ------------------- interfaces methods end -------------------

	private sendMessageOverallScoreboard(): void {
		this.broadcast('TOURNAMENT_OVERALL_SCOREBOARD', this._overallScoreboardOfTheRound.getRoundScoreboardJSONToClients());
	}

	private sendMessageTableOfPoints(): void {
		this.broadcast('TOURNAMENT_TABLE_OF_POINTS', this._tableOfPoints.getTableJSONToclients());
	}

	private sendMessagePlayerFinalPosition(player: TournamentPlayer): void {
		this.sendMessageToPlayer(player, 'TOURNAMENT_PLAYER_FINAL_POSITION', player.position);
	}

	private broadcast(messageType: MessageType, obj?: Object) {
		for (const tournamentPlayer of this._tournamentPlayers.values()) {
			this.sendMessageToPlayer(tournamentPlayer, messageType, obj);
		}
	}

	private sendMessageToPlayer(player: TournamentPlayer, messageType: MessageType, obj?: Object) {

		if (this._tournamentStatus === TournamentStatus.FINISHED) return;

		if (!player.isOnline) return;

		let sender = new Sender(player.webSocketUserSession.getWebsocket);

		let messageToSend = (obj === undefined)
			? new Message(messageType)
			: new MessageWithValue(messageType, obj);

		sender.sendMessage(messageToSend);
	}
}