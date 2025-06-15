import { TypeOfEnvironment } from "../ParametersVariables.js";
import { NetUserStatusLogin } from "./net/NetUserStatusLogin.js";
import { TestUserStatusLogin } from "./test/TestUserStatusLogin.js";
export class UserStatusLoginStrategy {
    _userStatusLogin;
    constructor(typeOfEnvironment) {
        if (typeOfEnvironment === TypeOfEnvironment.TEST) {
            this._userStatusLogin = new TestUserStatusLogin();
        }
        else {
            this._userStatusLogin = new NetUserStatusLogin();
        }
    }
    setUserStatus(userId, status) {
        this._userStatusLogin.setUserStatus(userId, status);
    }
}
