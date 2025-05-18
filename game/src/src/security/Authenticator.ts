import { WebSocketUserSession } from "../WebSocketUserSession";
import { Message } from "../message/Message";

export interface Authenticator<T>{

    /**
     * Authenticates the user
     *
     * return: If the user is authenticated a true is returned otherwise false is returned
     */
    makeLogin(ws : WebSocketUserSession, message : Message<T>) : boolean;
}
