"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticatorSimple = void 0;
class AuthenticatorSimple {
    makeLogin(ws, message) {
        if (message.getValue.getUserToken == '123456') {
            ws.setUserId = message.getValue.getUserId;
            return true;
        }
        return false;
    }
    makeLogout(ws) {
        ws.cleanSession();
    }
}
exports.AuthenticatorSimple = AuthenticatorSimple;
