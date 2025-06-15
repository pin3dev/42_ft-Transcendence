export class WebSocketUserSession {
    static sessionCountId = 1;
    id;
    userId = "";
    gameId = 0;
    tournamentId = 0;
    userName = "";
    ws;
    constructor(webSocket) {
        this.id = WebSocketUserSession.sessionCountId++;
        this.ws = webSocket;
    }
    get getId() {
        return this.id;
    }
    get getUserId() {
        return this.userId;
    }
    set setUserId(userId) {
        this.userId = userId;
    }
    get getUserName() {
        return this.userName;
    }
    set setUserName(userName) {
        this.userName = userName;
    }
    get getGameId() {
        return this.gameId;
    }
    set setGameId(gameId) {
        this.gameId = gameId;
    }
    get getWebsocket() {
        return this.ws;
    }
    set setTournamentId(tournamentId) {
        this.tournamentId = tournamentId;
    }
    get getTournamentId() {
        return this.tournamentId;
    }
    /**
     * reset the properties to their default values
     */
    cleanSession() {
        this.userId = "";
        this.gameId = 0;
        this.tournamentId = 0;
        this.userName = "";
    }
}
