import { Message, MessageType } from "./Message";

export class FatalErrorMessage extends Message{
	constructor(type: MessageType){
		super(type);
	}
};