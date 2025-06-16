import { TypeOfEnvironment } from "../ParametersVariables.js";
import { NetMatchSave } from "./net/NetMatchSave.js";
import { TestMatchSave } from "./test/TestMatchSave.js";
export class MatchSaveStrategy {
    _matchSave;
    constructor(typeOfEnvironment) {
        if (typeOfEnvironment === TypeOfEnvironment.TEST) {
            this._matchSave = new TestMatchSave();
        }
        else {
            this._matchSave = new NetMatchSave();
        }
    }
    save(match) {
        this._matchSave.save(match);
    }
}
