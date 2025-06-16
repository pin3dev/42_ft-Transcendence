"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServerSSL_1 = require("./ServerSSL");
const ParametersVariables_1 = require("./ParametersVariables");
const GameAPISingleton_1 = require("./GameAPISingleton");
const Server_1 = require("./Server");
let envVariables = new ParametersVariables_1.ParametersVariables();
const args = process.argv.slice(2);
if (!envVariables.loadParameters(args))
    process.exit(1);
GameAPISingleton_1.GameAPISingleton.setTypeOfEnvironment(envVariables.getTypeOfEnvironment());
if (envVariables.getTypeOfEnvironment() === ParametersVariables_1.TypeOfEnvironment.PROD) {
    if (!process.env.JWT_PUBLIC_KEY_BASE64 || !process.env.SSL_KEY_BASE64 || !process.env.SSL_CERT_BASE64) {
        console.error("Missing required environment variables.");
        process.exit(1);
    }
    const JWTpublicKey = Buffer.from(process.env.JWT_PUBLIC_KEY_BASE64, 'base64').toString('utf-8');
    const SSLkey = Buffer.from(process.env.SSL_KEY_BASE64, 'base64').toString('utf-8');
    const SSLcert = Buffer.from(process.env.SSL_CERT_BASE64, 'base64').toString('utf-8');
    const server = new ServerSSL_1.ServerSSL(envVariables, SSLkey, SSLcert, JWTpublicKey);
    server.startServer();
}
else {
    const server = new Server_1.Server(envVariables, "");
    server.startServer();
}
