"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParametersVariables = exports.TypeOfEnvironment = void 0;
var TypeOfEnvironment;
(function (TypeOfEnvironment) {
    TypeOfEnvironment[TypeOfEnvironment["TEST"] = 0] = "TEST";
    TypeOfEnvironment[TypeOfEnvironment["PROD"] = 1] = "PROD";
})(TypeOfEnvironment || (exports.TypeOfEnvironment = TypeOfEnvironment = {}));
class ParametersVariables {
    constructor() {
        this._httpsPort = 0;
        this._wssPort = 0;
        this._isTestEnviroment = false;
    }
    get httpsPort() {
        return this._httpsPort;
    }
    set httpsPort(httpsPort) {
        this._httpsPort = httpsPort;
    }
    get wssPort() {
        return this._wssPort;
    }
    set wssPort(wssPort) {
        this._wssPort = wssPort;
    }
    get isTestEnviroment() {
        return this._isTestEnviroment;
    }
    set isTestEnviroment(isTestEnviroment) {
        this._isTestEnviroment = isTestEnviroment;
    }
    getNumberParameter(args, parameterName) {
        const parameterNameIndex = args.indexOf(parameterName);
        if (parameterNameIndex === -1 || args[parameterNameIndex + 1] === undefined) {
            this.printErrorParameterDoesntExist(parameterName);
            return null;
        }
        const value = args[parameterNameIndex + 1];
        const parsed = parseInt(value);
        if (isNaN(parsed)) {
            this.printInvalidParameterValue(value, parameterName);
            return null;
        }
        return parsed;
    }
    getBooleanParameter(args, parameterName) {
        const parameterNameIndex = args.indexOf(parameterName);
        if (parameterNameIndex === -1 || args[parameterNameIndex + 1] === undefined) {
            this.printErrorParameterDoesntExist(parameterName);
            return null;
        }
        const value = args[parameterNameIndex + 1].toLowerCase();
        if (value !== 'true' && value !== 'false') {
            this.printInvalidParameterValue(value, parameterName);
            return null;
        }
        return (value === 'true');
    }
    loadParameters(args) {
        const httpsPort = this.getNumberParameter(args, ParametersVariables.PARAMETER_NAME_HTTPS_PORT);
        if (httpsPort === null)
            return false;
        const wssPort = this.getNumberParameter(args, ParametersVariables.PARAMETER_NAME_WSS_PORT);
        if (wssPort === null)
            return false;
        const isTestEnv = this.getBooleanParameter(args, ParametersVariables.PARAMETER_NAME_IS_ENVIRONMENT_TEST);
        if (isTestEnv === null)
            return false;
        this._httpsPort = httpsPort;
        this._wssPort = wssPort;
        this._isTestEnviroment = isTestEnv;
        return true;
    }
    getTypeOfEnvironment() {
        return (this._isTestEnviroment) ? TypeOfEnvironment.TEST : TypeOfEnvironment.PROD;
    }
    printErrorParameterDoesntExist(parameterName) {
        console.error(`The parameter ${parameterName} doesn't exists`);
    }
    printInvalidParameterValue(value, parameterName) {
        console.error(`The value ${value} is invalid to parameter ${parameterName}`);
    }
}
exports.ParametersVariables = ParametersVariables;
ParametersVariables.PARAMETER_NAME_HTTPS_PORT = 'HTTPS_PORT';
ParametersVariables.PARAMETER_NAME_WSS_PORT = 'WSS_PORT';
ParametersVariables.PARAMETER_NAME_IS_ENVIRONMENT_TEST = 'IS_ENVIRONMENT_TEST';
