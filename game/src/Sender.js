import WebSocket from 'ws';
export class Sender {
    webSocket;
    constructor(webSocket) {
        this.webSocket = webSocket;
    }
    sendMessagex(message) {
        if (this.webSocket.readyState === WebSocket.OPEN) {
            this.webSocket.send(message);
            return true;
        }
        return false;
    }
    sendMessage(message) {
        if (this.webSocket.readyState === WebSocket.OPEN) {
            const strMessage = JSON.stringify(message);
            this.webSocket.send(strMessage);
            return true;
        }
        return false;
    }
}
