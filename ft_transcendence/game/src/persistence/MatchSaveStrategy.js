"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchSaveStrategy = void 0;
const ParametersVariables_1 = require("../ParametersVariables");
const NetMatchSave_1 = require("./net/NetMatchSave");
const TestMatchSave_1 = require("./test/TestMatchSave");
class MatchSaveStrategy {
    constructor(typeOfEnvironment) {
        if (typeOfEnvironment === ParametersVariables_1.TypeOfEnvironment.TEST) {
            this._matchSave = new TestMatchSave_1.TestMatchSave();
        }
        else {
            this._matchSave = new NetMatchSave_1.NetMatchSave();
        }
    }
    save(match) {
        this._matchSave.save(match);
    }
}
exports.MatchSaveStrategy = MatchSaveStrategy;
