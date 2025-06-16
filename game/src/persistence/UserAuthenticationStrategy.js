import { TypeOfEnvironment } from "../ParametersVariables.js";
import { NetUserAuthentication } from "./net/NetUserAuthentication.js";
import { TestUserAuthentication } from "./test/TestUserAuthentication.js";
export class UserAuthenticationStrategy {
    _userAuthentication;
    constructor(typeOfEnvironment) {
        if (typeOfEnvironment === TypeOfEnvironment.TEST) {
            this._userAuthentication = new TestUserAuthentication();
        }
        else {
            this._userAuthentication = new NetUserAuthentication();
        }
    }
    isUserAuthenticated(userId) {
        return this._userAuthentication.isUserAuthenticated(userId);
    }
}
