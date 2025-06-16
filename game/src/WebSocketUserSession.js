"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketUserSession = void 0;
class WebSocketUserSession {
    constructor(webSocket) {
        this.userId = "";
        this.gameId = 0;
        this.tournamentId = 0;
        this.userName = "";
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
    cleanSession() {
        this.userId = "";
        this.gameId = 0;
        this.tournamentId = 0;
        this.userName = "";
    }
}
exports.WebSocketUserSession = WebSocketUserSession;
WebSocketUserSession.sessionCountId = 1;
