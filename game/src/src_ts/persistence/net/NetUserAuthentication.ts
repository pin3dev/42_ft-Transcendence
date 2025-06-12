import { UserAuthentication } from "../UserAuthentication";

export class NetUserAuthentication implements UserAuthentication {

	isUserAuthenticated(userId: string): boolean {
		return true;
	}

}