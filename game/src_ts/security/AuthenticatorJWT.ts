import { WebSocketUserSession } from "../WebSocketUserSession";
import { Authenticator } from "./Authenticator";
import { AuthenticationMessage } from "../message/AuthenticationMessage";
import { MessageWithValue } from "../message/MessageWithValue";
import jwt from 'jsonwebtoken';

export class AuthenticatorJWT implements Authenticator<AuthenticationMessage>{

	private _jwtpublicKey : string;

	constructor(jwtPublicKey : string){
		this._jwtpublicKey = jwtPublicKey;
	}

    makeLogin(ws : WebSocketUserSession, message : MessageWithValue<AuthenticationMessage>) : boolean{
		try {

			const token = message.getValue.getUserToken;
			const userId = message.getValue.getUserId;

      		jwt.verify(token, this._jwtpublicKey, { algorithms: ['RS256'] });

			ws.setUserId = userId;

      		return true;

    	} catch (err) {
   		   return false;
    	}
    }

	makeLogout(ws : WebSocketUserSession): void{
		ws.cleanSession();
	}
}





/*
const jwt = require("@fastify/jwt");

export class AuthenticatorJWT implements {

	  // JWT
  await app.register(jwt, {
    secret: async () => JWTpublicKey,
    verify: { algorithms: ["RS256"] },
    sign: false
  });


}*/