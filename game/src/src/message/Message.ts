
export type AuthenticationMessageTypeRequest = 'AUTHENTICATION_LOGIN' |
	'AUTHENTICATION_LOGOUT';

export type GameMessageTypeRequest = 'GAME_CREATE_GLOBAL_MATCH' |
	'GAME_START_MATCH' |
	'GAME_PADDLE_UP_KEYDOWN' |
	'GAME_PADDLE_UP_KEYUP' |
	'GAME_PADDLE_DOWN_KEYDOWN' |
	'GAME_PADDLE_DOWN_KEYUP' |
	'GAME_ABORT';

export type MessageTypeRequest = AuthenticationMessageTypeRequest |
	GameMessageTypeRequest;

export type FatalErrorMessageTypeResponse = 'FATAL_ERROR_INVALID_JSON_SYNTAX' |
	'FATAL_ERROR_INVALID_TYPE_MESSAGE' |
	'FATAL_ERROR_INVALID_VALUE_PROPERTY';

export type ErrorMessageTypeResponse =
	'ERROR_USER_NOT_AUTHENTICATED' |
	'ERROR_INVALID_CREDENTIALS' |
	'ERROR_MATCH_DOES_NOT_EXIST';

export type AuthenticationMessageTypeResponse = 'OK_USER_AUTHENTICATED';

export type GameMessageTypeResponse = 'GAME_WAITING_NEW_PLAYER' |
	'GAME_CAN_START' |
	'GAME_FULL' |
	'GAME_COUNT_DOWN' |
	'GAME_STATUS' |
	'GAME_PLAYER_WIN' |
	'GAME_PLAYER_DRAW' |
	'GAME_PLAYER_LOSE' |
	'GAME_ABORTED';

export type TournamentMessageTypeResponse =
	'ERROR_TOURNAMENT_FULL' |
	'ERROR_TOURNAMENT_IN_PROGRESS' |
	'ERROR_TOURNAMENT_FINISHED' |
	'TOURNAMENT_WAITING_PLAYER' |
	'TOURNAMENT_COUNT_DOWN';

export type MessageTypeResponse = FatalErrorMessageTypeResponse |
	ErrorMessageTypeResponse |
	AuthenticationMessageTypeResponse |
	GameMessageTypeResponse |
	TournamentMessageTypeResponse;

export type MessageType = MessageTypeRequest | MessageTypeResponse;


export class Message {

	public static readonly authenticationMessageTypeRequest = new Map<string, AuthenticationMessageTypeRequest>([
		['AUTHENTICATION_LOGIN', 'AUTHENTICATION_LOGIN'],
		['AUTHENTICATION_LOGOUT', 'AUTHENTICATION_LOGOUT']
	]);

	public static readonly gameMessageTypeRequest = new Map<string, GameMessageTypeRequest>([
		['GAME_CREATE_GLOBAL_MATCH', 'GAME_CREATE_GLOBAL_MATCH'],
		['GAME_START_MATCH', 'GAME_START_MATCH'],
		['GAME_PADDLE_UP_KEYDOWN', 'GAME_PADDLE_UP_KEYDOWN'],
		['GAME_PADDLE_UP_KEYUP', 'GAME_PADDLE_UP_KEYUP'],
		['GAME_PADDLE_DOWN_KEYDOWN', 'GAME_PADDLE_DOWN_KEYDOWN'],
		['GAME_PADDLE_DOWN_KEYUP', 'GAME_PADDLE_DOWN_KEYUP'],
		['GAME_ABORT', 'GAME_ABORT']
	]);

	public static readonly messageTypeRequest = new Map<string, MessageTypeRequest>([
		...Message.authenticationMessageTypeRequest,
		...Message.gameMessageTypeRequest,
	]);

	public static readonly fatalErrorMessageTypeResponse = new Map<string, FatalErrorMessageTypeResponse>([
		['FATAL_ERROR_INVALID_JSON_SYNTAX', 'FATAL_ERROR_INVALID_JSON_SYNTAX'],
		['FATAL_ERROR_INVALID_TYPE_MESSAGE', 'FATAL_ERROR_INVALID_TYPE_MESSAGE'],
		['FATAL_ERROR_INVALID_VALUE_PROPERTY', 'FATAL_ERROR_INVALID_VALUE_PROPERTY']

	]);

	public static readonly errorMessageTypeResponse = new Map<string, ErrorMessageTypeResponse>([
		['ERROR_USER_NOT_AUTHENTICATED', 'ERROR_USER_NOT_AUTHENTICATED'],
		['ERROR_INVALID_CREDENTIALS', 'ERROR_INVALID_CREDENTIALS'],
		['ERROR_MATCH_DOES_NOT_EXIST', 'ERROR_MATCH_DOES_NOT_EXIST']
	]);

	public static readonly authenticationMessageTypeResponse = new Map<string, AuthenticationMessageTypeResponse>([
		['OK_USER_AUTHENTICATED', 'OK_USER_AUTHENTICATED']
	]);

	public static readonly gameMessageTypeResponse = new Map<string, GameMessageTypeResponse>([
		['GAME_WAITING_NEW_PLAYER', 'GAME_WAITING_NEW_PLAYER'],
		['GAME_CAN_START', 'GAME_CAN_START'],
		['GAME_FULL', 'GAME_FULL'],
		['GAME_COUNT_DOWN', 'GAME_COUNT_DOWN'],
		['GAME_STATUS', 'GAME_STATUS'],
		['GAME_PLAYER_WIN', 'GAME_PLAYER_WIN'],
		['GAME_PLAYER_LOSE', 'GAME_PLAYER_LOSE'],
		['GAME_ABORTED', 'GAME_ABORTED']
	]);

	public static readonly tournamentMessageTypeResponse = new Map<string, TournamentMessageTypeResponse>([
		['ERROR_TOURNAMENT_FULL', 'ERROR_TOURNAMENT_FULL'],
		['ERROR_TOURNAMENT_IN_PROGRESS', 'ERROR_TOURNAMENT_IN_PROGRESS'],
		['ERROR_TOURNAMENT_FINISHED', 'ERROR_TOURNAMENT_FINISHED'],
		['TOURNAMENT_WAITING_PLAYER', 'TOURNAMENT_WAITING_PLAYER'],
		['TOURNAMENT_COUNT_DOWN', 'TOURNAMENT_COUNT_DOWN']
	]);

	public static readonly messageTypeResponse = new Map<string, MessageTypeResponse>([
		...Message.authenticationMessageTypeResponse,
		...Message.gameMessageTypeResponse,
		...Message.fatalErrorMessageTypeResponse,
		...Message.errorMessageTypeResponse
	]);


	public static readonly messageType = new Map<string, MessageType>([
		...Message.messageTypeRequest,
		...Message.messageTypeResponse
	]);

	private type: string;

	constructor(type: string) {
		this.type = type;
	}

	public get getType() {
		return this.type;
	}

}
