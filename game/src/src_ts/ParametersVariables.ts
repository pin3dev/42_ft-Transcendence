
export class ParametersVariables {

	public static readonly PARAMETER_NAME_HTTPS_PORT = 'HTTPS_PORT';
	public static readonly PARAMETER_NAME_WSS_PORT = 'WSS_PORT';
	public static readonly PARAMETER_NAME_IS_ENVIRONMENT_TEST = 'IS_ENVIRONMENT_TEST';

	private _httpsPort: number;
	private _wssPort: number;
	private _isTestEnviroment: boolean;

	constructor() {
		this._httpsPort = 0;
		this._wssPort = 0;
		this._isTestEnviroment = false;
	}

	public get httpsPort(): number {
		return this._httpsPort;
	}

	public set httpsPort(httpsPort: number) {
		this._httpsPort = httpsPort;
	}

	public get wssPort(): number {
		return this._wssPort;
	}

	public set wssPort(wssPort: number) {
		this._wssPort = wssPort;
	}

	public get isTestEnviroment(): boolean {
		return this._isTestEnviroment
	}

	public set isTestEnviroment(isTestEnviroment: boolean) {
		this._isTestEnviroment = isTestEnviroment;
	}

	public getNumberParameter(args: string[], parameterName: string): number | null {

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

	public getBooleanParameter(args: string[], parameterName: string): boolean | null {

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

		return (value === 'true')
	}

	public loadParameters(args : string[]) : boolean{

		const httpsPort = this.getNumberParameter(args, ParametersVariables.PARAMETER_NAME_HTTPS_PORT);
		if (httpsPort === null) return false;

		const wssPort = this.getNumberParameter(args, ParametersVariables.PARAMETER_NAME_WSS_PORT);
		if (wssPort === null) return false;

		const isTestEnv = this.getBooleanParameter(args, ParametersVariables.PARAMETER_NAME_IS_ENVIRONMENT_TEST);
		if (isTestEnv === null) return false;

		this._httpsPort = httpsPort;
		this._wssPort = wssPort;
		this._isTestEnviroment = isTestEnv;

		return true;
	}

	private printErrorParameterDoesntExist(parameterName: string): void {
		console.error(`The parameter ${parameterName} doesn't exists`);
	}

	private printInvalidParameterValue(value: string, parameterName: string): void {
		console.error(`The value ${value} is invalid to parameter ${parameterName}`);
	}
}