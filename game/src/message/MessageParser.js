import { AuthenticationMessage } from './AuthenticationMessage.js';
import { FatalErrorMessage } from './FatalErrorMessage.js';
import { Message } from './Message.js';
import { MessageWithValue } from './MessageWithValue.js';
export class MessageParser {
    static messageFromJSON(message) {
        let json = undefined;
        try {
            json = JSON.parse(message.toString());
        }
        catch (error) {
            return new FatalErrorMessage('FATAL_ERROR_INVALID_JSON_SYNTAX');
        }
        const { type, value } = json;
        if (Message.authenticationMessageTypeRequest.has(type)) {
            return MessageParser.createAuthenticationMessage(type, value);
        }
        else if (Message.messageTypeRequest.has(type)) {
            return this.createTournamentMessage(type, value);
        }
        else if (Message.messageTypeRequest.has(type)) {
            return new MessageWithValue(type, value);
        }
        return new FatalErrorMessage('FATAL_ERROR_INVALID_TYPE_MESSAGE');
    }
    static createTournamentMessage(type, value) {
        if (type === 'TOURNAMENT_CREATE') {
            if (!this.isNumber(value)) {
                return new FatalErrorMessage('FATAL_ERROR_INVALID_VALUE_PROPERTY');
            }
            return new MessageWithValue(type, value);
        }
        return new Message(type);
    }
    static createAuthenticationMessage(type, value) {
        if (this.isAuthenticationValueValid(value)) {
            const authMessage = new AuthenticationMessage(value.userToken, value.userId);
            return new MessageWithValue(type, authMessage);
        }
        return new FatalErrorMessage('FATAL_ERROR_INVALID_VALUE_PROPERTY');
    }
    static isAuthenticationValueValid(val) {
        return (val &&
            typeof val === 'object' &&
            typeof val.userToken === 'string' &&
            typeof val.userId === 'string');
    }
    static isNumber(val) {
        return typeof val === 'number';
    }
}
