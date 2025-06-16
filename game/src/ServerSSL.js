import * as https from 'https';
import { WebSocketServer } from 'ws';
import { WebSocketUserSession } from './WebSocketUserSession.js';
import { API } from './API.js';
export class ServerSSL {
    _parametersVariables;
    SSLkey;
    SSLcert;
    JWTpublicKey;
    constructor(parametersVariables, SSLkey, SSLcert, JWTpublicKey) {
        this._parametersVariables = parametersVariables;
        this.SSLkey = SSLkey;
        this.SSLcert = SSLcert;
        this.JWTpublicKey = JWTpublicKey;
    }
    startServer() {
        const api = new API(this.JWTpublicKey);
        const clients = new Map();
        const wssServer = https.createServer({
            key: this.SSLkey,
            cert: this.SSLcert
        });
        const wss = new WebSocketServer({ server: wssServer });
        wss.on('connection', (ws) => {
            const session = new WebSocketUserSession(ws);
            clients.set(ws, session);
            ws.on('message', (message) => {
                const session = clients.get(ws);
                if (!session)
                    return;
                api.message(session, message);
            });
            ws.on('close', () => {
                const session = clients.get(ws);
                if (!session)
                    return;
                api.close(session);
                clients.delete(ws);
            });
        });
        wssServer.listen(this._parametersVariables.wssPort, () => {
            console.log(`WSS server listening on https://localhost:${this._parametersVariables.wssPort}`);
        });
    }
}
