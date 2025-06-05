import WebSocket from 'ws';
import { Message } from './message/Message';


export class Sender {
    webSocket: WebSocket;

    constructor(webSocket: WebSocket) {
        this.webSocket = webSocket;
    }

    public sendMessagex(message : string): boolean {
        if (this.webSocket.readyState === WebSocket.OPEN) {
            this.webSocket.send(message);
            return true;
        }
        return false;
    }

    public sendMessage(message: Message) : boolean{
        if (this.webSocket.readyState === WebSocket.OPEN){
            const strMessage = JSON.stringify(message);
            this.webSocket.send(strMessage);
            return true;
        }
        return false;
    }

    /*
    criar o teste para o JSON.stringify para ver se as mensagens estao saindo com JSON
    validos!
    Criar o Makefile e explicar todas as mensagens!
    */
}
