import { TypeOfEnvironment } from "../ParametersVariables";
import { NetMatchSave } from "./net/NetMatchSave";
import { TestMatchSave } from "./test/TestMatchSave";
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
