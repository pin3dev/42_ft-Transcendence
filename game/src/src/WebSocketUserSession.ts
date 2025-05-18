import WebSocket from 'ws';

export class WebSocketUserSession{

    private userId: string = "";
    private gameId: number = 0;
    private ws;

    constructor(webSocket : WebSocket){
        this.ws = webSocket;
    }

    public get getUserId(){
        return this.userId;
    }

    public set setUserId(userId: string){
        this.userId = userId;
    }

    public get getGameId(){
        return this.gameId;
    }

    public set setGameId(gameId: number){
        this.gameId = gameId;
    }

    public get getWebsocket() : WebSocket{
        return this.ws;
    }

}
