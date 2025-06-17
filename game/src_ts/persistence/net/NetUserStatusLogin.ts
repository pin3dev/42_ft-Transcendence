import { Status, UserStatusLogin } from "../UserStatusLogin";

const redisModules = require("../../../pckg/redis/modules.js");

export class NetUserStatusLogin implements UserStatusLogin {
	setUserStatus(userId: string, status: Status): void{
		//console.logog('NetUserStatusLogin: setUserStatus');

		let theMessage : string = `user_status:${userId}`;

		//console.logog('NetUserStatusLogin: setUserStatus, the userId('+theMessage+'');

		if (status == Status.ONLINE){
			redisModules.setCache(theMessage, true, null);
		}else if (status == Status.OFFLINE){
			redisModules.setCache(theMessage, false, null);
		}
	}
}