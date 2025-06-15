import jwt from 'jsonwebtoken';
export class AuthenticatorJWT {
    _jwtpublicKey;
    constructor(jwtPublicKey) {
        this._jwtpublicKey = jwtPublicKey;
    }
    makeLogin(ws, message) {
        try {
            const token = message.getValue.getUserToken;
            const userId = message.getValue.getUserId;
            jwt.verify(token, this._jwtpublicKey, { algorithms: ['RS256'] });
            ws.setUserId = userId;
            return true;
        }
        catch (err) {
            return false;
        }
    }
    makeLogout(ws) {
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
