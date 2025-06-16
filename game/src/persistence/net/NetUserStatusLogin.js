"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetUserStatusLogin = void 0;
const UserStatusLogin_1 = require("../UserStatusLogin");
const redisModules = require("../../../pckg/redis/modules.js");
class NetUserStatusLogin {
    setUserStatus(userId, status) {
        //console.log('NetUserStatusLogin: setUserStatus');
        let theMessage = `user_status:${userId}`;
        //console.log('NetUserStatusLogin: setUserStatus, the userId(' + theMessage + '');
        if (status == UserStatusLogin_1.Status.ONLINE) {
            redisModules.setCache(theMessage, true, null);
        }
        else if (status == UserStatusLogin_1.Status.OFFLINE) {
            redisModules.setCache(theMessage, false, null);
        }
    }
}
exports.NetUserStatusLogin = NetUserStatusLogin;
