"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticatorStrategy = void 0;
const ParametersVariables_1 = require("../ParametersVariables");
const AuthenticatorJWT_1 = require("./AuthenticatorJWT");
const AuthenticatorSimple_1 = require("./AuthenticatorSimple");
class AuthenticatorStrategy {
    constructor(typeOfEnvironment, jwtPublicKey) {
        if (typeOfEnvironment === ParametersVariables_1.TypeOfEnvironment.TEST) {
            this._authenticator = new AuthenticatorSimple_1.AuthenticatorSimple();
        }
        else {
            this._authenticator = new AuthenticatorJWT_1.AuthenticatorJWT(jwtPublicKey);
        }
    }
    makeLogin(ws, message) {
        return this._authenticator.makeLogin(ws, message);
    }
    makeLogout(ws) {
        return this._authenticator.makeLogout(ws);
    }
}
exports.AuthenticatorStrategy = AuthenticatorStrategy;
