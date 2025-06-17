import * as http from 'http';
import * as path from 'path';
import * as fs from 'fs';
import { WebSocket, WebSocketServer } from 'ws';
import { WebSocketUserSession } from './WebSocketUserSession';

import { API } from './API';
import { ParametersVariables } from './ParametersVariables';

export class Server{

private _parametersVariables : ParametersVariables;
private _JWTpublicKey : string;

constructor(paratersVariables: ParametersVariables, JWTpublicKey : string){
	this._parametersVariables = paratersVariables;
	this._JWTpublicKey = JWTpublicKey;
}

public startServer() {

	const api = new API(this._JWTpublicKey);

	const clients = new Map<WebSocket, WebSocketUserSession>();

	const server = http.createServer((req, res) => {

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

	const wss = new WebSocketServer({ port: this._parametersVariables.wssPort });

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

	server.listen(this._parametersVariables.httpsPort, () => {
		//console.logog(`Server listening on http://localhost:${this._parametersVariables.httpsPort}`);
	});
}
}