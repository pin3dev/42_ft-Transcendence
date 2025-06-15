import { Message } from "./Message.js";
export class MessageWithValue extends Message {
    value;
    constructor(type, value) {
        super(type);
        this.value = value;
    }
    get getValue() {
        return this.value;
    }
}
