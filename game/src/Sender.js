"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sender = void 0;
const ws_1 = __importDefault(require("ws"));
class Sender {
    constructor(webSocket) {
        this.webSocket = webSocket;
    }
    sendMessagex(message) {
        if (this.webSocket.readyState === ws_1.default.OPEN) {
            this.webSocket.send(message);
            return true;
        }
        return false;
    }
    sendMessage(message) {
        if (this.webSocket.readyState === ws_1.default.OPEN) {
            const strMessage = JSON.stringify(message);
            this.webSocket.send(strMessage);
            return true;
        }
        return false;
    }
}
exports.Sender = Sender;
