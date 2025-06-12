import { Game } from "../game/Game";
import { GameListener } from "../game/GameListener";
import { Message, MessageType, MessageTypeResponse } from "../message/Message";
import { MessageWithValue } from "../message/MessageWithValue";
import { Sender } from "../Sender";
import { WebSocketUserSession } from "../WebSocketUserSession";
import { WebSocketUserSessionListener } from "../WebSocketUserSessionListener";
import { MatchesScoreboard } from "./MatchesScoreboard";
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
	CREATE_ROUND,
	ROUND_GOING_ON
}

export class Tournament implements GameListener, WebSocketUserSessionListener {

	public static readonly MAX_PLAYERS = 16;

	private _numberOfPlayer: number = 0;

	private _tournamentPlayers: Map<WebSocketUserSession, TournamentPlayer>;
	private _gamesInTheRound: Map<Number, Game>;

	// overall tournament ranking
	private _tableOfPoints: TableOfPoints;

	// all round scores
	private matchesScoreboard: MatchesScoreboard;

	private _tournamentStatus: TournamentStatus;

	private _id: number;


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

	constructor(numberOfPlayer: number) {

		this._numberOfPlayer = numberOfPlayer;

		this._roundCount = 0;
		this._roundCountMaxRounds = numberOfPlayer - 1;

		this._tournamentPlayers = new Map<WebSocketUserSession, TournamentPlayer>();
		this._gamesInTheRound = new Map<Number, Game>();

		this._tableOfPoints = new TableOfPoints();

		this._tournamentStatus = TournamentStatus.WAITING_PLAYERS;


		this._numberOfGamesCompletedInTheRound = 0;
		this._numberOfGamesCompletedInTheRoundMaxPossible = numberOfPlayer / 2;

		this._roundStatus = RoundStatus.COUNT_DOWN;

		this._countDown = 3;
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

		// add the id of this tournament in webSocketUserSession to make it easier
		// to search and know that the player's game is part of this tournament
		webSocketUserSession.setTournamentId = this._id;

		let tournamentPlayer: TournamentPlayer = new TournamentPlayer(true, webSocketUserSession);
		this._tournamentPlayers.set(webSocketUserSession, tournamentPlayer);

		sender.sendMessage(new Message('TOURNAMENT_WAITING_PLAYER'));

		this._tournamentStatus = TournamentStatus.READY;
		return (this._tournamentPlayers.size === this._numberOfPlayer);
	}

	public removePlayer(webSocketUserSession: WebSocketUserSession): void {

		if (this._tournamentStatus === TournamentStatus.FINISHED) {
			return;
		}

		if (this._tournamentStatus === TournamentStatus.WAITING_PLAYERS) {
			this._tournamentPlayers.delete(webSocketUserSession);
			return;
		}

		let tournamentPlayer: TournamentPlayer | undefined = this._tournamentPlayers.get(webSocketUserSession);
		if (tournamentPlayer !== undefined) {
			tournamentPlayer.isOnline = false;
		}
	}

	public start() {
		if (this._tournamentStatus !== TournamentStatus.READY) return;
		this._tournamentStatus = TournamentStatus.RUNNING;
		this._roundStatus = RoundStatus.COUNT_DOWN;
		this.tournamentLoop();
	}

	public getStatus() : TournamentStatus{
		return this._tournamentStatus;
	}


	//--- private methods ---

	private tournamentLoop() {
		this.mainInterval = setInterval(() => {
			switch (this._roundStatus) {
				case RoundStatus.COUNT_DOWN:
					this.sendCountDown();
					break;

				case RoundStatus.CREATE_ROUND:
					this._roundStatus = RoundStatus.ROUND_GOING_ON;
					this.doRound();
					break;
				case RoundStatus.ROUND_GOING_ON:
					{
						if (this._numberOfGamesCompletedInTheRound === this._numberOfGamesCompletedInTheRoundMaxPossible &&
							this._roundCount === this._roundCountMaxRounds) {
							// method to finishe tournament ===========================================================================================================================================================
							clearInterval(this.mainInterval!);
							this._tournamentStatus = TournamentStatus.FINISHED;
						} else if (this._numberOfGamesCompletedInTheRound === this._numberOfGamesCompletedInTheRoundMaxPossible) {
							this._roundStatus = RoundStatus.COUNT_DOWN;
						}
					}
			}
		}, 10);
	}

	private stopCountDownRoutine() {
		if (this.countDownInterval) {
			clearInterval(this.countDownInterval);
			this.countDownInterval = undefined;
		}
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


	private doRound(): void {
		// countDeJogosDaRodada = 0;
		// limpar mapa de jogos da rodada do torneio
		// pegar uma rodada no mapa de jogos do torneio

		// criar a table de jogos da rodada e enviar para todos jogadores
		// enviar a tabela de pontos do torneio para todos os jogadores do torneio

		// criar os games das partidas (remover o id antigo do game do jogador para nao dar bug e add o do novo jogo)
			// na hora de criar os games tournamentPlayer offline vs tournamenPlayer offline tem que incrementar o countador de jogos da rodada para nao ter bug de espera infinita
			// ter um contador da hora de criar o jogos, pois se todos os jogos forem null, temos que terminar o torneio, nao faz sentido ter jogadores fantasmas!

		this._numberOfGamesCompletedInTheRound = 0;
		this._gamesInTheRound.clear();

		this.matchesScoreboard = new MatchesScoreboard();
		this.matchesScoreboard.

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


	// ------------------- interfaces methods -------------------

	playerMakePoint(): void {
		throw new Error("Method not implemented.");
	}
	gameEnd(): void {
		throw new Error("Method not implemented.");
	}


	// messages from user
	message(ws: WebSocketUserSession, message: Message): void {
		throw new Error("Method not implemented.");
	}
	close(ws: WebSocketUserSession): void {
		throw new Error("Method not implemented.");
	}
}