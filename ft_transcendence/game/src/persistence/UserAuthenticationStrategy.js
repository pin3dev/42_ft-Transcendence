"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthenticationStrategy = void 0;
const ParametersVariables_1 = require("../ParametersVariables");
const NetUserAuthentication_1 = require("./net/NetUserAuthentication");
const TestUserAuthentication_1 = require("./test/TestUserAuthentication");
class UserAuthenticationStrategy {
    constructor(typeOfEnvironment) {
        if (typeOfEnvironment === ParametersVariables_1.TypeOfEnvironment.TEST) {
            this._userAuthentication = new TestUserAuthentication_1.TestUserAuthentication();
        }
        else {
            this._userAuthentication = new NetUserAuthentication_1.NetUserAuthentication();
        }
    }
    isUserAuthenticated(userId) {
        return this._userAuthentication.isUserAuthenticated(userId);
    }
}
exports.UserAuthenticationStrategy = UserAuthenticationStrategy;
