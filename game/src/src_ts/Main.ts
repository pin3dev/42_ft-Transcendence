import { ServerSSL } from "./ServerSSL";
import { ParametersVariables } from "./ParametersVariables"
import { GameAPISingleton } from "./GameAPISingleton";

if (!process.env.JWT_PUBLIC_KEY_BASE64 || !process.env.SSL_KEY_BASE64 || !process.env.SSL_CERT_BASE64) {
  console.error("Missing required environment variables.");
  process.exit(1);
}

const JWTpublicKey = Buffer.from(process.env.JWT_PUBLIC_KEY_BASE64, 'base64').toString('utf-8');
const SSLkey = Buffer.from(process.env.SSL_KEY_BASE64, 'base64').toString('utf-8');
const SSLcert = Buffer.from(process.env.SSL_CERT_BASE64, 'base64').toString('utf-8');

const args = process.argv.slice(2);

let envVariables: ParametersVariables = new ParametersVariables();

if (!envVariables.loadParameters(args)) process.exit(1);

//const server = new Server(envVariables);
//server.startServer();

GameAPISingleton.setTypeOfEnvironment(envVariables.getTypeOfEnvironment());

const server = new ServerSSL(envVariables, SSLkey, SSLcert, JWTpublicKey);
server.startServer();