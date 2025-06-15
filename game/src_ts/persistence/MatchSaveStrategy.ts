import { Game } from "../game/Game";
import { TypeOfEnvironment } from "../ParametersVariables";
import { MatchSave } from "./MatchSave";
import { NetMatchSave } from "./net/NetMatchSave";
import { TestMatchSave } from "./test/TestMatchSave";

export class MatchSaveStrategy implements MatchSave {

	private _matchSave: MatchSave;

	constructor(typeOfEnvironment: TypeOfEnvironment) {
		if (typeOfEnvironment === TypeOfEnvironment.TEST) {
			this._matchSave = new TestMatchSave();
		} else {
			this._matchSave = new NetMatchSave();
		}
	}

	save(match: Game): void {
		this._matchSave.save(match);
	}
}