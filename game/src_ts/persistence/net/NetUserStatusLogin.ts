import { Status, UserStatusLogin } from "../UserStatusLogin";

const redisModules = require("../../../pckg/redis/modules.js");

export class NetUserStatusLogin implements UserStatusLogin {
	setUserStatus(userId: string, status: Status): void{
		//console.log('NetUserStatusLogin: setUserStatus');

		let theMessage : string = `user_status:${userId}`;

		//console.log('NetUserStatusLogin: setUserStatus, the userId('+theMessage+'');

		if (status == Status.ONLINE){
			redisModules.setCache(theMessage, true, null);
		}else if (status == Status.OFFLINE){
			redisModules.setCache(theMessage, false, null);
		}
	}
}