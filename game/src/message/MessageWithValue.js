"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageWithValue = void 0;
const Message_1 = require("./Message");
class MessageWithValue extends Message_1.Message {
    constructor(type, value) {
        super(type);
        this.value = value;
    }
    get getValue() {
        return this.value;
    }
}
exports.MessageWithValue = MessageWithValue;
