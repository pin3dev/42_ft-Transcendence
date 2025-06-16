import { GameAPISingleton } from "../GameAPISingleton.js";
import { Status } from "../persistence/UserStatusLogin.js";
import { UserStatusLoginStrategy } from "../persistence/UserStatusLoginStrategy.js";
export class UserStatus {
    _usersStatus;
    _userStatusLogin;
    constructor() {
        this._usersStatus = new Map();
        this._userStatusLogin = new UserStatusLoginStrategy(GameAPISingleton.getTypeOfEnvironment());
    }
    addUserOnline(userId) {
        console.log('UserStatus: addUserOnline');
        const current = this._usersStatus.get(userId);
        if (current === undefined) {
            this._userStatusLogin.setUserStatus(userId, Status.ONLINE);
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
            this._userStatusLogin.setUserStatus(userId, Status.OFFLINE);
        }
        else {
            this._usersStatus.set(userId, current - 1);
        }
    }
}
