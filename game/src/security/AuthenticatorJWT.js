"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticatorJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthenticatorJWT {
    constructor(jwtPublicKey) {
        this._jwtpublicKey = jwtPublicKey;
    }
    makeLogin(ws, message) {
        try {
            const token = message.getValue.getUserToken;
            const userId = message.getValue.getUserId;
            jsonwebtoken_1.default.verify(token, this._jwtpublicKey, { algorithms: ['RS256'] });
            ws.setUserId = userId;
            return true;
        }
        catch (err) {
            return false;
        }
    }
    makeLogout(ws) {
        ws.cleanSession();
    }
}
exports.AuthenticatorJWT = AuthenticatorJWT;
