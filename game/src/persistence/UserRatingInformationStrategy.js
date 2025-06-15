import { TypeOfEnvironment } from "../ParametersVariables.js";
import { NetUserRatingInformation } from "./net/NetUserRatingInformation.js";
import { TestUserRatingInformation } from "./test/TestUserRatingInformation.js";
export class UserRatingInformationStrategy {
    _userRatingInformation;
    constructor(typeOfEnvironment) {
        if (typeOfEnvironment === TypeOfEnvironment.TEST) {
            this._userRatingInformation = new TestUserRatingInformation();
        }
        else {
            this._userRatingInformation = new NetUserRatingInformation();
        }
    }
    getUserRating(userId) {
        return this._userRatingInformation.getUserRating(userId);
    }
    updateUserRating(userId, newRatingValue) {
        return this._userRatingInformation.updateUserRating(userId, newRatingValue);
    }
}
