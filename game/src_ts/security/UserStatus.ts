import { GameAPISingleton } from "../GameAPISingleton";
import { Status, UserStatusLogin } from "../persistence/UserStatusLogin";
import { UserStatusLoginStrategy } from "../persistence/UserStatusLoginStrategy";

export class UserStatus {

	private _usersStatus: Map<string, number>;
	private _userStatusLogin : UserStatusLogin;

	constructor() {
		this._usersStatus = new Map<string, number>();
		this._userStatusLogin =  new UserStatusLoginStrategy(GameAPISingleton.getTypeOfEnvironment());

	}

	public addUserOnline(userId : string): void {

		//console.logog('UserStatus: addUserOnline');
		const current = this._usersStatus.get(userId);

		if (current === undefined) {
			this._userStatusLogin.setUserStatus(userId, Status.ONLINE);
			this._usersStatus.set(userId, 1);
		} else {
			this._usersStatus.set(userId, current + 1);
		}
	}

	public addUserOffline(userId : string): void {
		const current = this._usersStatus.get(userId);

		if (current === undefined) {
			return;
		}

		if (current <= 1) {
			this._usersStatus.delete(userId);
			this._userStatusLogin.setUserStatus(userId, Status.OFFLINE);
		} else {
			this._usersStatus.set(userId, current - 1);
		}
	}

}