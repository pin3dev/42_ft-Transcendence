import { Status, UserStatusLogin } from "../UserStatusLogin";

const { setCache } = require("../../../../pckg/redis/modules.js") as {
    setCache: (key: string, value: any, ttl?: number | null) => Promise<void>
};

export class NetUserStatusLogin implements UserStatusLogin{
	async setUserStatus(userId : string, status : Status) : Promise<void>{
		 await setCache(`user_status:${userId}`, status, null);
	}
}