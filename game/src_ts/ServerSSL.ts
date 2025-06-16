import * as https from 'https';
import { WebSocket, WebSocketServer } from 'ws';
import { WebSocketUserSession } from './WebSocketUserSession';

import { API } from './API';
import { ParametersVariables } from './ParametersVariables';

export class ServerSSL {

	private _parametersVariables: ParametersVariables;
	private SSLkey: string;
	private SSLcert: string;
	private JWTpublicKey: string;

	constructor(parametersVariables: ParametersVariables, SSLkey: string, SSLcert: string, JWTpublicKey: string) {
		this._parametersVariables = parametersVariables;
		this.SSLkey = SSLkey;
		this.SSLcert = SSLcert;
		this.JWTpublicKey = JWTpublicKey;
	}

	public startServer() {

		const api = new API(this.JWTpublicKey);
		const clients = new Map<WebSocket, WebSocketUserSession>();

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
				if (!session) return;
				api.message(session, message);
			});

			ws.on('close', () => {
				const session = clients.get(ws);
				if (!session) return;
				api.close(session);
				clients.delete(ws);
			});
		});

		wssServer.listen(this._parametersVariables.wssPort, () => {
			//console.log(`WSS server listening on https://localhost:${this._parametersVariables.wssPort}`);
		});
	}
}
