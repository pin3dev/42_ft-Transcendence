"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageParser = void 0;
const AuthenticationMessage_1 = require("./AuthenticationMessage");
const FatalErrorMessage_1 = require("./FatalErrorMessage");
const Message_1 = require("./Message");
const MessageWithValue_1 = require("./MessageWithValue");
class MessageParser {
    static messageFromJSON(message) {
        let json = undefined;
        try {
            json = JSON.parse(message.toString());
        }
        catch (error) {
            return new FatalErrorMessage_1.FatalErrorMessage('FATAL_ERROR_INVALID_JSON_SYNTAX');
        }
        const { type, value } = json;
        if (Message_1.Message.authenticationMessageTypeRequest.has(type)) {
            return MessageParser.createAuthenticationMessage(type, value);
        }
        else if (Message_1.Message.messageTypeRequest.has(type)) {
            return this.createTournamentMessage(type, value);
        }
        else if (Message_1.Message.messageTypeRequest.has(type)) {
            return new MessageWithValue_1.MessageWithValue(type, value);
        }
        return new FatalErrorMessage_1.FatalErrorMessage('FATAL_ERROR_INVALID_TYPE_MESSAGE');
    }
    static createTournamentMessage(type, value) {
        if (type === 'TOURNAMENT_CREATE') {
            if (!this.isNumber(value)) {
                return new FatalErrorMessage_1.FatalErrorMessage('FATAL_ERROR_INVALID_VALUE_PROPERTY');
            }
            return new MessageWithValue_1.MessageWithValue(type, value);
        }
        return new Message_1.Message(type);
    }
    static createAuthenticationMessage(type, value) {
        if (this.isAuthenticationValueValid(value)) {
            const authMessage = new AuthenticationMessage_1.AuthenticationMessage(value.userToken, value.userId);
            return new MessageWithValue_1.MessageWithValue(type, authMessage);
        }
        return new FatalErrorMessage_1.FatalErrorMessage('FATAL_ERROR_INVALID_VALUE_PROPERTY');
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
exports.MessageParser = MessageParser;
