import { Server } from "./Server";
import { ParametersVariables } from "./ParametersVariables"

const args = process.argv.slice(2);

let envVariables: ParametersVariables = new ParametersVariables();

if (!envVariables.loadParameters(args)) process.exit(1);

const server = new Server(envVariables);
server.startServer();