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
exports.ServerSSL = void 0;
const https = __importStar(require("https"));
const ws_1 = require("ws");
const WebSocketUserSession_1 = require("./WebSocketUserSession");
const API_1 = require("./API");
class ServerSSL {
    constructor(parametersVariables, SSLkey, SSLcert, JWTpublicKey) {
        this._parametersVariables = parametersVariables;
        this.SSLkey = SSLkey;
        this.SSLcert = SSLcert;
        this.JWTpublicKey = JWTpublicKey;
    }
    startServer() {
        const api = new API_1.API(this.JWTpublicKey);
        const clients = new Map();
        const wssServer = https.createServer({
            key: this.SSLkey,
            cert: this.SSLcert
        });
        const wss = new ws_1.WebSocketServer({ server: wssServer });
        wss.on('connection', (ws) => {
            const session = new WebSocketUserSession_1.WebSocketUserSession(ws);
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
exports.ServerSSL = ServerSSL;
