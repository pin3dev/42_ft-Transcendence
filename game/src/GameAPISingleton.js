"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameAPISingleton = void 0;
class GameAPISingleton {
    static getTypeOfEnvironment() {
        return GameAPISingleton._typeOfEnvironment;
    }
    static setTypeOfEnvironment(typeOfEnvironment) {
        GameAPISingleton._typeOfEnvironment = typeOfEnvironment;
    }
}
exports.GameAPISingleton = GameAPISingleton;
