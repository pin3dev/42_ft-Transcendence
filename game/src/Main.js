import { ServerSSL } from "./ServerSSL.js";
import { ParametersVariables, TypeOfEnvironment } from "./ParametersVariables.js";
import { GameAPISingleton } from "./GameAPISingleton.js";
import { Server } from "./Server.js";
let envVariables = new ParametersVariables();
const args = process.argv.slice(2);
if (!envVariables.loadParameters(args))
    process.exit(1);
GameAPISingleton.setTypeOfEnvironment(envVariables.getTypeOfEnvironment());
if (envVariables.getTypeOfEnvironment() === TypeOfEnvironment.PROD) {
    if (!process.env.JWT_PUBLIC_KEY_BASE64 || !process.env.SSL_KEY_BASE64 || !process.env.SSL_CERT_BASE64) {
        console.error("Missing required environment variables.");
        process.exit(1);
    }
    const JWTpublicKey = Buffer.from(process.env.JWT_PUBLIC_KEY_BASE64, 'base64').toString('utf-8');
    const SSLkey = Buffer.from(process.env.SSL_KEY_BASE64, 'base64').toString('utf-8');
    const SSLcert = Buffer.from(process.env.SSL_CERT_BASE64, 'base64').toString('utf-8');
    const server = new ServerSSL(envVariables, SSLkey, SSLcert, JWTpublicKey);
    server.startServer();
}
else {
    const server = new Server(envVariables, "");
    server.startServer();
}
