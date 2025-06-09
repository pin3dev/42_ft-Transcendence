import WebSocket from 'ws';

export class WebSocketUserSession {

	private static sessionCountId: number = 1;

	private id: number;
	private userId: string = "";
	private gameId: number = 0;
	private tournamentId: number = 0;
	private userName: string = "";
	private ws;

	constructor(webSocket: WebSocket) {
		this.id = WebSocketUserSession.sessionCountId++;
		this.ws = webSocket;
	}

	public get getId() {
		return this.id;
	}

	public get getUserId() {
		return this.userId;
	}

	public set setUserId(userId: string) {
		this.userId = userId;
	}

	public get getUserName(): string {
		return this.userName;
	}

	public set setUserName(userName: string) {
		this.userName = userName;
	}

	public get getGameId() {
		return this.gameId;
	}

	public set setGameId(gameId: number) {
		this.gameId = gameId;
	}

	public get getWebsocket(): WebSocket {
		return this.ws;
	}

	public set setTournamentId(tournamentId: number) {
		this.tournamentId = tournamentId;
	}

	public get getTournamentId(): number {
		return this.tournamentId;
	}

	/**
	 * reset the properties to their default values
	 */
	public cleanSession(): void {
		this.userId = "";
		this.gameId = 0;
		this.tournamentId = 0;
		this.userName = "";
	}
}
