import { TypeOfEnvironment } from "../ParametersVariables.js";
import { AuthenticatorJWT } from "./AuthenticatorJWT.js";
import { AuthenticatorSimple } from "./AuthenticatorSimple.js";
export class AuthenticatorStrategy {
    _authenticator;
    constructor(typeOfEnvironment, jwtPublicKey) {
        if (typeOfEnvironment === TypeOfEnvironment.TEST) {
            this._authenticator = new AuthenticatorSimple();
        }
        else {
            this._authenticator = new AuthenticatorJWT(jwtPublicKey);
        }
    }
    makeLogin(ws, message) {
        return this._authenticator.makeLogin(ws, message);
    }
    makeLogout(ws) {
        return this._authenticator.makeLogout(ws);
    }
}
