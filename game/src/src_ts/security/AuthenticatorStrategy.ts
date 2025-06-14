import { AuthenticationMessage } from "../message/AuthenticationMessage";
import { Message } from "../message/Message";
import { TypeOfEnvironment } from "../ParametersVariables";
import { WebSocketUserSession } from "../WebSocketUserSession";
import { Authenticator } from "./Authenticator";
import { AuthenticatorJWT } from "./AuthenticatorJWT";
import { AuthenticatorSimple } from "./AuthenticatorSimple";


export class AuthenticatorStrategy implements Authenticator<AuthenticationMessage>{

	private _authenticator : Authenticator<AuthenticationMessage>;

	constructor(typeOfEnvironment : TypeOfEnvironment, jwtPublicKey: string){
		if (typeOfEnvironment === TypeOfEnvironment.TEST) {
			this._authenticator = new AuthenticatorSimple();
		} else {
			this._authenticator = new AuthenticatorJWT(jwtPublicKey);
		}
	}

	makeLogin(ws: WebSocketUserSession, message: Message): boolean {
		return this._authenticator.makeLogin(ws, message);
	}
	makeLogout(ws: WebSocketUserSession): void {
		return this._authenticator.makeLogout(ws);
	}

}