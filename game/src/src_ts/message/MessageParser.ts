import { RawData } from 'ws';
import { AuthenticationMessage } from './AuthenticationMessage';
import { FatalErrorMessage } from './FatalErrorMessage';
import { Message, MessageType } from './Message';
import { MessageWithValue } from './MessageWithValue';

export class MessageParser {

	public static messageFromJSON(message: RawData): Message | MessageWithValue<any> {

		let json = undefined;

		try {
			json = JSON.parse(message.toString());
		} catch (error) {
			return new FatalErrorMessage('FATAL_ERROR_INVALID_JSON_SYNTAX');
		}

		const { type, value } = json;

		if (Message.authenticationMessageTypeRequest.has(type)) {
			return MessageParser.createAuthenticationMessage(type, value);
		} else if (Message.messageTypeRequest.has(type)) {
			return this.createTournamentMessage(type, value);
		}
		else if (Message.messageTypeRequest.has(type)) {
			return new MessageWithValue<any>(type, value);
		}
		return new FatalErrorMessage('FATAL_ERROR_INVALID_TYPE_MESSAGE');
	}

	private static createTournamentMessage(type: MessageType, value: any) {
		if (type === 'TOURNAMENT_CREATE') {
			if (!this.isNumber(value)){
				return new FatalErrorMessage('FATAL_ERROR_INVALID_VALUE_PROPERTY');
			}
			return new MessageWithValue<number>(type, value);
		}
		return new Message(type);
	}

	private static createAuthenticationMessage(type: MessageType, value: object) {
		if (this.isAuthenticationValueValid(value)) {
			const authMessage = new AuthenticationMessage(value.userToken, value.userId);
			return new MessageWithValue(type, authMessage);
		}
		return new FatalErrorMessage('FATAL_ERROR_INVALID_VALUE_PROPERTY');
	}

	private static isAuthenticationValueValid(val: any): val is { userToken: string; userId: string } {
		return (
			val &&
			typeof val === 'object' &&
			typeof val.userToken === 'string' &&
			typeof val.userId === 'string'
		);
	}

	private static isNumber(val: any): val is number {
		return typeof val === 'number';
	}

}