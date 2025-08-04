"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamePlayer = void 0;
class GamePlayer {
    constructor(isOnline, webSocketUserSession) {
        this._isOnline = isOnline;
        this._webSocketUserSession = webSocketUserSession;
    }
    get isOnline() {
        return this._isOnline;
    }
    set isOnline(isOnline) {
        this._isOnline = isOnline;
    }
    get webSocketUserSession() {
        return this._webSocketUserSession;
    }
    get getPlayerName() {
        return this._webSocketUserSession.getUserName;
    }
}
exports.GamePlayer = GamePlayer;
