import { Status, UserStatusLogin } from "../UserStatusLogin";

// Evite usar import/export aqui se o módulo for CommonJS
const redisModules = require("../../../pckg/redis/modules.js");

export class NetUserStatusLogin implements UserStatusLogin {
	setUserStatus(userId: string, status: Status): void{
		console.log('NetUserStatusLogin: setUserStatus');
		if (Status.ONLINE){
			redisModules.setCache(`user_status:${userId}`, true, null);
		}else if (Status.OFFLINE){
			redisModules.setCache(`user_status:${userId}`, false, null);
		}
	}
}