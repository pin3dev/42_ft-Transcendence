"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatus = void 0;
const GameAPISingleton_1 = require("../GameAPISingleton");
const UserStatusLogin_1 = require("../persistence/UserStatusLogin");
const UserStatusLoginStrategy_1 = require("../persistence/UserStatusLoginStrategy");
class UserStatus {
    constructor() {
        this._usersStatus = new Map();
        this._userStatusLogin = new UserStatusLoginStrategy_1.UserStatusLoginStrategy(GameAPISingleton_1.GameAPISingleton.getTypeOfEnvironment());
    }
    addUserOnline(userId) {
        //console.log('UserStatus: addUserOnline');
        const current = this._usersStatus.get(userId);
        if (current === undefined) {
            this._userStatusLogin.setUserStatus(userId, UserStatusLogin_1.Status.ONLINE);
            this._usersStatus.set(userId, 1);
        }
        else {
            this._usersStatus.set(userId, current + 1);
        }
    }
    addUserOffline(userId) {
        const current = this._usersStatus.get(userId);
        if (current === undefined) {
            return;
        }
        if (current <= 1) {
            this._usersStatus.delete(userId);
            this._userStatusLogin.setUserStatus(userId, UserStatusLogin_1.Status.OFFLINE);
        }
        else {
            this._usersStatus.set(userId, current - 1);
        }
    }
}
exports.UserStatus = UserStatus;
