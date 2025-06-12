import { NetUserAuthentication } from "./net/NetUserAuthentication";
import { TestUserAuthentication } from "./test/TestUserAuthentication";
import { UserAuthentication } from "./UserAuthentication";


export class UserAuthenticationStrategy implements UserAuthentication {

	private _userAuthentication: UserAuthentication;

	constructor(typeOfEnvironment: string) {
		if (typeOfEnvironment === 'test') {
			this._userAuthentication = new TestUserAuthentication();
		} else {
			this._userAuthentication = new NetUserAuthentication();
		}
	}

	isUserAuthenticated(userId: string): boolean {
		return this._userAuthentication.isUserAuthenticated(userId);
	}
}