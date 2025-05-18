import { RawData } from 'ws';


export type AuthenticationMessageTypeRequest = 'AUTHENTICATION_MAKE';

export type GameMessageTypeRequest = 'GAME_CREATE_GLOBAL_MATCH' |
									 'GAME_START_MATCH' |
									 'GAME_PADDLE_UP' |
									 'GAME_PADDLE_DOWN' |
									 'GAME_ABORT' ;

export type MessageTypeRequest =    AuthenticationMessageTypeRequest |
									GameMessageTypeRequest;

export type ErrorMessageTypeResponse =	'ERROR_INVALID_JSON_SYNTAX' |
										'ERROR_INVALID_TYPE_MESSAGE' |
										'ERROR_USER_NOT_AUTHENTICATED' |
										'ERROR_INVALID_CREDENTIALS' |
										'ERROR_MATCH_DOES_NOT_EXIST'; //quando o usuário manda o id de um match invalido

export type AuthenticationMessageTypeResponse = 'OK_USER_AUTHENTICATED';

export type GameMessageTypeResponse =	'GAME_WAITING_NEW_PLAYER' |
										'GAME_CAN_START' |
										'GAME_FULL' |
										'GAME_COUNT_DOWN' |
										'GAME_STATUS' |
										'GAME_PLAYER_WIN' |
										'GAME_PLAYER_LOSE' |
										'GAME_ABORTED' ;


export type MessageTypeResponse = 	ErrorMessageTypeResponse |
									AuthenticationMessageTypeResponse |
									GameMessageTypeResponse ;

export type MessageType = MessageTypeRequest | MessageTypeResponse ;


export class Message<T> {

	public static readonly authenticationMessageTypeRequest = new Map<string, AuthenticationMessageTypeRequest>([
    	['AUTHENTICATION_MAKE', 'AUTHENTICATION_MAKE']
	]);

	public static readonly gameMessageTypeRequest = new Map<string, GameMessageTypeRequest>([
		['GAME_CREATE_GLOBAL_MATCH','GAME_CREATE_GLOBAL_MATCH'],
		['GAME_START_MATCH','GAME_START_MATCH'],
		['GAME_PADDLE_UP','GAME_PADDLE_UP'],
		['GAME_PADDLE_DOWN','GAME_PADDLE_DOWN'],
		['GAME_ABORT','GAME_ABORT']
	]);

	public static readonly messageTypeRequest = new Map<string, MessageTypeRequest>([
		...Message.authenticationMessageTypeRequest,
		...Message.gameMessageTypeRequest,
	]);







	public static readonly errorMessageTypeResponse = new Map<string, ErrorMessageTypeResponse>([
		['ERROR_INVALID_JSON_SYNTAX','ERROR_INVALID_JSON_SYNTAX'],
		['ERROR_INVALID_TYPE_MESSAGE','ERROR_INVALID_TYPE_MESSAGE'],
		['ERROR_USER_NOT_AUTHENTICATED','ERROR_USER_NOT_AUTHENTICATED'],
		['ERROR_INVALID_CREDENTIALS','ERROR_INVALID_CREDENTIALS'],
		['ERROR_MATCH_DOES_NOT_EXIST', 'ERROR_MATCH_DOES_NOT_EXIST']
	]);

	public static readonly authenticationMessageTypeResponse = new Map<string, AuthenticationMessageTypeResponse>([
		['OK_USER_AUTHENTICATED','OK_USER_AUTHENTICATED']
	]);

	public static readonly gameMessageTypeResponse = new Map<string, GameMessageTypeResponse>([
		['GAME_WAITING_NEW_PLAYER','GAME_WAITING_NEW_PLAYER'],
		['GAME_CAN_START','GAME_CAN_START'],
		['GAME_FULL','GAME_FULL'],
		['GAME_COUNT_DOWN','GAME_COUNT_DOWN'],
		['GAME_STATUS','GAME_STATUS'],
		['GAME_PLAYER_WIN','GAME_PLAYER_WIN'],
		['GAME_PLAYER_LOSE','GAME_PLAYER_LOSE'],
		['GAME_ABORTED', 'GAME_ABORTED']
	]);

	public static readonly messageTypeResponse = new Map<string, MessageTypeResponse>([
		...Message.authenticationMessageTypeResponse,
		...Message.gameMessageTypeResponse,
		...Message.errorMessageTypeResponse
	]);


	public static readonly messageType = new Map<string, MessageType>([
		...Message.messageTypeRequest,
		...Message.messageTypeResponse
	]);

	private type: string;
	private value: T;

	constructor(type: string, value: T) {
		this.type = type;
		this.value = value;
	}

	public get getType() {
		return this.type;
	}

	public get getValue() {
		return this.value;
	}

	static fromJSON(message: RawData): Message<any> {

		let json = undefined;

		try {
			json = JSON.parse(message.toString());
		} catch (error) {
			return new Message<null>('ERROR_INVALID_JSON_SYNTAX', null);
		}

		const { type, value } = json;

		if (Message.messageTypeRequest.has(type)){
			return new Message<any>(type, value);
		}
		return new Message<null>('ERROR_INVALID_TYPE_MESSAGE', null);
	}
}

