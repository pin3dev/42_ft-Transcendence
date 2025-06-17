"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatusLoginStrategy = void 0;
const ParametersVariables_1 = require("../ParametersVariables");
const NetUserStatusLogin_1 = require("./net/NetUserStatusLogin");
const TestUserStatusLogin_1 = require("./test/TestUserStatusLogin");
class UserStatusLoginStrategy {
    constructor(typeOfEnvironment) {
        //console.logog('UserStatusLoginStrategy: constructor');
        if (typeOfEnvironment === ParametersVariables_1.TypeOfEnvironment.TEST) {
            this._userStatusLogin = new TestUserStatusLogin_1.TestUserStatusLogin();
        }
        else {
            this._userStatusLogin = new NetUserStatusLogin_1.NetUserStatusLogin();
        }
    }
    setUserStatus(userId, status) {
        this._userStatusLogin.setUserStatus(userId, status);
    }
}
exports.UserStatusLoginStrategy = UserStatusLoginStrategy;
