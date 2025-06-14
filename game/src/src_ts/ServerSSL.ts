import * as https from 'https';
import * as path from 'path';
import * as fs from 'fs';
import { WebSocket, WebSocketServer } from 'ws';
import { WebSocketUserSession } from './WebSocketUserSession';

import { API } from './API';
import { ParametersVariables } from './ParametersVariables';

export class ServerSSL {

	private _parametersVariables: ParametersVariables;
	private SSLkey: string;
	private SSLcert: string;
	private JWTpublicKey: string;

	constructor(paratersVariables: ParametersVariables, SSLkey: string, SSLcert: string, JWTpublicKey: string) {
		this._parametersVariables = paratersVariables;
		this.SSLkey = SSLkey;
		this.SSLcert = SSLcert;
		this.JWTpublicKey = JWTpublicKey;
	}

	public startServer() {

		const api = new API(this.JWTpublicKey);

		const clients = new Map<WebSocket, WebSocketUserSession>();

		const server = https.createServer({
			key: this.SSLkey,
			cert: this.SSLcert
		}
			, (req, res) => {

				let urlPath = req.url ?? '/'; // Se req.url for undefined, assume '/'
				let filePath = path.join(__dirname, '../public', urlPath === '/' ? 'index.html' : urlPath);
				let ext = path.extname(filePath);
				let contentType = 'text/html';

				switch (ext) {
					case '.js': contentType = 'application/javascript'; break;
					case '.css': contentType = 'text/css'; break;
				}

				fs.readFile(filePath, (err, content) => {
					if (err) {
						res.writeHead(404);
						res.end('Not Found');
						return;
					}
					res.writeHead(200, { 'Content-Type': contentType });
					res.end(content);
				});
			});

		const wssServer = https.createServer({ key: this.SSLkey, cert: this.SSLcert }); // outro servidor
		const wss = new WebSocketServer({ server: wssServer });

		wss.on('connection', (ws) => {

			clients.set(ws, new WebSocketUserSession(ws));

			ws.on('message', (message) => {

				let wsSession = clients.get(ws);

				if (!wsSession) return;

				api.message(wsSession, message);
			});

			ws.on('close', () => {

				let wsSession = clients.get(ws);

				if (!wsSession) return;

				api.close(wsSession);

				clients.delete(ws);
			});

		});

		wssServer.listen(this._parametersVariables.wssPort, () => {
			console.log(`WebServer listening on https://localhost:${this._parametersVariables.wssPort}`);
		});

		server.listen(this._parametersVariables.httpsPort, () => {
			console.log(`Server listening on https://localhost:${this._parametersVariables.httpsPort}`);
		});
	}
}