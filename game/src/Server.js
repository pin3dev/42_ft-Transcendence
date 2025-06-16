"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const http = __importStar(require("http"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const ws_1 = require("ws");
const WebSocketUserSession_1 = require("./WebSocketUserSession");
const API_1 = require("./API");
class Server {
    constructor(paratersVariables, JWTpublicKey) {
        this._parametersVariables = paratersVariables;
        this._JWTpublicKey = JWTpublicKey;
    }
    startServer() {
        const api = new API_1.API(this._JWTpublicKey);
        const clients = new Map();
        const server = http.createServer((req, res) => {
            let urlPath = req.url ?? '/';
            let filePath = path.join(__dirname, '../public', urlPath === '/' ? 'index.html' : urlPath);
            let ext = path.extname(filePath);
            let contentType = 'text/html';
            switch (ext) {
                case '.js':
                    contentType = 'application/javascript';
                    break;
                case '.css':
                    contentType = 'text/css';
                    break;
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
        const wss = new ws_1.WebSocketServer({ port: this._parametersVariables.wssPort });
        wss.on('connection', (ws) => {
            clients.set(ws, new WebSocketUserSession_1.WebSocketUserSession(ws));
            ws.on('message', (message) => {
                let wsSession = clients.get(ws);
                if (!wsSession)
                    return;
                api.message(wsSession, message);
            });
            ws.on('close', () => {
                let wsSession = clients.get(ws);
                if (!wsSession)
                    return;
                api.close(wsSession);
                clients.delete(ws);
            });
        });
        server.listen(this._parametersVariables.httpsPort, () => {
            console.log(`Server listening on http://localhost:${this._parametersVariables.httpsPort}`);
        });
    }
}
exports.Server = Server;
