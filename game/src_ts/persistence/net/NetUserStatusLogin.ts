import { Status, UserStatusLogin } from "../UserStatusLogin";

// Evite usar import/export aqui se o módulo for CommonJS
const redisModules = require("../../../../pckg/redis/modules.js");

export class NetUserStatusLogin implements UserStatusLogin {
	async setUserStatus(userId: string, status: Status): Promise<void> {
		await redisModules.setCache(`user_status:${userId}`, status, null);
	}
}