import { publishEvent, EventTypes } from "../../../pckg/redis/modules.js";

export class NetUserStatusLogin {
    async setUserStatus(userId, status) {
        await setCache(`user_status:${userId}`, status, null);
    }
}
