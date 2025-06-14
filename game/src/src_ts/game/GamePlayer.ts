import { WebSocketUserSession } from "../WebSocketUserSession";

export class GamePlayer{

	private _webSocketUserSession: WebSocketUserSession;
	private _isOnline: boolean;

	constructor(isOnline: boolean, webSocketUserSession: WebSocketUserSession) {
		this._isOnline = isOnline;
		this._webSocketUserSession = webSocketUserSession;
	}

	public get isOnline(): boolean {
		return this._isOnline;
	}

	public set isOnline(isOnline: boolean) {
		this._isOnline = isOnline;
	}

	public get webSocketUserSession(): WebSocketUserSession {
		return this._webSocketUserSession;
	}

	public get getPlayerName(): string {
		return this._webSocketUserSession.getUserName;
	}
}