import { WebSocketUserSession } from "../WebSocketUserSession";
import { Authenticator } from "./Authenticator";
import { AuthenticationMessage } from "../message/AuthenticationMessage";
import { MessageWithValue } from "../message/MessageWithValue";

export class AuthenticatorSimple implements Authenticator<AuthenticationMessage>{

    makeLogin(ws : WebSocketUserSession, message : MessageWithValue<AuthenticationMessage>) : boolean{
		console.log('Authentication: ');
        if (message.getValue.getUserToken == '123456'){
            ws.setUserId = '123';
			return true;
        }
		return false;
    }

	makeLogout(ws : WebSocketUserSession): void{
		ws.cleanSession();
	}
}
