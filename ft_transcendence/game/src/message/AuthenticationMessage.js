"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationMessage = void 0;
class AuthenticationMessage {
    constructor(userToken, userId) {
        this.userToken = "";
        this.userId = "";
        this.userToken = userToken;
        this.userId = userId;
    }
    get getUserToken() {
        return this.userToken;
    }
    set setUserToken(userToken) {
        this.userToken = userToken;
    }
    get getUserId() {
        return this.userId;
    }
    set setUserId(userId) {
        this.userId = userId;
    }
}
exports.AuthenticationMessage = AuthenticationMessage;
;
