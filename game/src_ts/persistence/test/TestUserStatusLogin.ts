import { Status, UserStatusLogin } from "../UserStatusLogin";

export class TestUserStatusLogin implements UserStatusLogin{
	setUserStatus(userId : string, status : Status) : void{
		//console.logog(' TestUserStatusLogin: setUserStatus');
	}
}