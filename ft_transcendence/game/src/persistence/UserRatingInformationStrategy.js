"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRatingInformationStrategy = void 0;
const ParametersVariables_1 = require("../ParametersVariables");
const NetUserRatingInformation_1 = require("./net/NetUserRatingInformation");
const TestUserRatingInformation_1 = require("./test/TestUserRatingInformation");
class UserRatingInformationStrategy {
    constructor(typeOfEnvironment) {
        if (typeOfEnvironment === ParametersVariables_1.TypeOfEnvironment.TEST) {
            this._userRatingInformation = new TestUserRatingInformation_1.TestUserRatingInformation();
        }
        else {
            this._userRatingInformation = new NetUserRatingInformation_1.NetUserRatingInformation();
        }
    }
    getUserRating(userId) {
        return this._userRatingInformation.getUserRating(userId);
    }
    updateUserRating(userId, newRatingValue) {
        return this._userRatingInformation.updateUserRating(userId, newRatingValue);
    }
}
exports.UserRatingInformationStrategy = UserRatingInformationStrategy;
