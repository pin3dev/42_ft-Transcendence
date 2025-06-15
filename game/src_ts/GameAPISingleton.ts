import { TypeOfEnvironment } from "./ParametersVariables";


export class GameAPISingleton{

	private static _typeOfEnvironment : TypeOfEnvironment;

	public static getTypeOfEnvironment() : TypeOfEnvironment{
		return GameAPISingleton._typeOfEnvironment;
	}

	public static setTypeOfEnvironment(typeOfEnvironment : TypeOfEnvironment){
		GameAPISingleton._typeOfEnvironment = typeOfEnvironment;
	}

}