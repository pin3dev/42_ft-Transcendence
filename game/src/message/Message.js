export class Message {
    static authenticationMessageTypeRequest = new Map([
        ['AUTHENTICATION_LOGIN', 'AUTHENTICATION_LOGIN'],
        ['AUTHENTICATION_LOGOUT', 'AUTHENTICATION_LOGOUT']
    ]);
    static gameMessageTypeRequest = new Map([
        ['GAME_CREATE_GLOBAL_MATCH', 'GAME_CREATE_GLOBAL_MATCH'],
        ['GAME_START_MATCH', 'GAME_START_MATCH'],
        ['GAME_PADDLE_UP_KEYDOWN', 'GAME_PADDLE_UP_KEYDOWN'],
        ['GAME_PADDLE_UP_KEYUP', 'GAME_PADDLE_UP_KEYUP'],
        ['GAME_PADDLE_DOWN_KEYDOWN', 'GAME_PADDLE_DOWN_KEYDOWN'],
        ['GAME_PADDLE_DOWN_KEYUP', 'GAME_PADDLE_DOWN_KEYUP'],
        ['GAME_ABORT', 'GAME_ABORT']
    ]);
    static tournamentMessageTypeRequest = new Map([
        ['TOURNAMENT_CREATE', 'TOURNAMENT_CREATE'],
        ['TOURNAMENT_TO_PARTICIPATE', 'TOURNAMENT_TO_PARTICIPATE']
    ]);
    static messageTypeRequest = new Map([
        ...Message.authenticationMessageTypeRequest,
        ...Message.gameMessageTypeRequest,
        ...Message.tournamentMessageTypeRequest
    ]);
    static fatalErrorMessageTypeResponse = new Map([
        ['FATAL_ERROR_INVALID_JSON_SYNTAX', 'FATAL_ERROR_INVALID_JSON_SYNTAX'],
        ['FATAL_ERROR_INVALID_TYPE_MESSAGE', 'FATAL_ERROR_INVALID_TYPE_MESSAGE'],
        ['FATAL_ERROR_INVALID_VALUE_PROPERTY', 'FATAL_ERROR_INVALID_VALUE_PROPERTY']
    ]);
    static errorMessageTypeResponse = new Map([
        ['ERROR_USER_NOT_AUTHENTICATED', 'ERROR_USER_NOT_AUTHENTICATED'],
        ['ERROR_INVALID_CREDENTIALS', 'ERROR_INVALID_CREDENTIALS'],
        ['ERROR_MATCH_DOES_NOT_EXIST', 'ERROR_MATCH_DOES_NOT_EXIST']
    ]);
    static authenticationMessageTypeResponse = new Map([
        ['OK_USER_AUTHENTICATED', 'OK_USER_AUTHENTICATED']
    ]);
    static gameMessageTypeResponse = new Map([
        ['GAME_WAITING_NEW_PLAYER', 'GAME_WAITING_NEW_PLAYER'],
        ['GAME_CAN_START', 'GAME_CAN_START'],
        ['GAME_FULL', 'GAME_FULL'],
        ['GAME_COUNT_DOWN', 'GAME_COUNT_DOWN'],
        ['GAME_STATUS', 'GAME_STATUS'],
        ['GAME_PLAYER_WIN', 'GAME_PLAYER_WIN'],
        ['GAME_PLAYER_LOSE', 'GAME_PLAYER_LOSE'],
        ['GAME_ABORTED', 'GAME_ABORTED']
    ]);
    static tournamentMessageTypeResponse = new Map([
        ['ERROR_TOURNAMENT_FULL', 'ERROR_TOURNAMENT_FULL'],
        ['ERROR_TOURNAMENT_IN_PROGRESS', 'ERROR_TOURNAMENT_IN_PROGRESS'],
        ['ERROR_TOURNAMENT_FINISHED', 'ERROR_TOURNAMENT_FINISHED'],
        ['TOURNAMENT_CREATED', 'TOURNAMENT_CREATED'],
        ['TOURNAMENT_WAITING_PLAYER', 'TOURNAMENT_WAITING_PLAYER'],
        ['TOURNAMENT_COUNT_DOWN', 'TOURNAMENT_COUNT_DOWN'],
        ['TOURNAMENT_OVERALL_SCOREBOARD', 'TOURNAMENT_OVERALL_SCOREBOARD'],
        ['TOURNAMENT_TABLE_OF_POINTS', 'TOURNAMENT_TABLE_OF_POINTS'],
        ['TOURNAMENT_PLAYER_FINAL_POSITION', 'TOURNAMENT_PLAYER_FINAL_POSITION']
    ]);
    static messageTypeResponse = new Map([
        ...Message.fatalErrorMessageTypeResponse,
        ...Message.errorMessageTypeResponse,
        ...Message.authenticationMessageTypeResponse,
        ...Message.gameMessageTypeResponse,
        ...Message.tournamentMessageTypeResponse
    ]);
    static messageType = new Map([
        ...Message.messageTypeRequest,
        ...Message.messageTypeResponse
    ]);
    type;
    constructor(type) {
        this.type = type;
    }
    get getType() {
        return this.type;
    }
}
