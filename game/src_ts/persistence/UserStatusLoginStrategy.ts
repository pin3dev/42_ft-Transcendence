import { TypeOfEnvironment } from "../ParametersVariables";
import { NetUserStatusLogin } from "./net/NetUserStatusLogin";
import { TestUserStatusLogin } from "./test/TestUserStatusLogin";
import { Status, UserStatusLogin } from "./UserStatusLogin";

export class UserStatusLoginStrategy implements UserStatusLogin {

	private _userStatusLogin: UserStatusLogin;

	constructor(typeOfEnvironment: TypeOfEnvironment) {
		//console.logog('UserStatusLoginStrategy: constructor');
			if (typeOfEnvironment === TypeOfEnvironment.TEST) {
			this._userStatusLogin = new TestUserStatusLogin();
		} else {
			this._userStatusLogin = new NetUserStatusLogin();
		}
	}

	setUserStatus(userId: string, status: Status): void {
		this._userStatusLogin.setUserStatus(userId, status);
	}
}