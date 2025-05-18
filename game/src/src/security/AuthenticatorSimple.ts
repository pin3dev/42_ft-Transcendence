import { WebSocketUserSession } from "../WebSocketUserSession";
import { Authenticator } from "./Authenticator";
import { Message } from "../message/Message";

export class AuthenticatorSimple implements Authenticator<string>{

    makeLogin(ws : WebSocketUserSession, message : Message<string>) : boolean{

        if (message.getValue === '123456'){
            ws.setUserId = '123';
			return true;
        }
		return false;
    }
}
