import { RawData } from 'ws';
import { WebSocketUserSession } from './WebSocketUserSession';
import { Message } from './message/Message';

export interface WebSocketUserSessionListener{
	message(ws: WebSocketUserSession, message: Message<any>) : void;
	close(ws: WebSocketUserSession): void;
}