import { UserAuthentication } from "../UserAuthentication";

export class TestUserAuthentication implements UserAuthentication {

	isUserAuthenticated(userId: string): boolean {
		return (userId === '123456');
	}

}