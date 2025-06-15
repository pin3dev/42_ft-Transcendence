export class AuthenticationMessage {
    userToken = "";
    userId = "";
    constructor(userToken, userId) {
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
;
