import { Message, MessageType } from "./Message";


export class MessageWithValue<T> extends Message{

	private value: T;

	constructor(type: MessageType, value: T){
		super(type);
		this.value = value;
	}

	public get getValue(): T{
		return this.value;
	}
}