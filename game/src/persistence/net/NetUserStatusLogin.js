import { Status } from "../UserStatusLogin.js";

import * as redisModules from "../../../../pckg/redis/modules.js";

export class NetUserStatusLogin {
    setUserStatus(userId, status) {
        console.log('NetUserStatusLogin: setUserStatus');
        let theMessage = `user_status:${userId}`;
        console.log('NetUserStatusLogin: setUserStatus, the userId(' + theMessage + '');
        if (Status.ONLINE) {
            redisModules.setCache(theMessage, true, null);
        }
        else if (Status.OFFLINE) {
            redisModules.setCache(theMessage, false, null);
        }
    }
}
