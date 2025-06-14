import { WebSocketUserSession } from './WebSocketUserSession';
import { Message } from './message/Message';

export interface WebSocketUserSessionListener{
	message(ws: WebSocketUserSession, message: Message) : void;
	close(ws: WebSocketUserSession): void;
}