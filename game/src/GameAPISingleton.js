export class GameAPISingleton {
    static _typeOfEnvironment;
    static getTypeOfEnvironment() {
        return GameAPISingleton._typeOfEnvironment;
    }
    static setTypeOfEnvironment(typeOfEnvironment) {
        GameAPISingleton._typeOfEnvironment = typeOfEnvironment;
    }
}
