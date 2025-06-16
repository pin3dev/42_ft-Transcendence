"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveRating = void 0;
const GameAPISingleton_1 = require("../GameAPISingleton");
const UserRatingInformationStrategy_1 = require("../persistence/UserRatingInformationStrategy");
const CalcRating_1 = require("./CalcRating");
class SaveRating {
    constructor() {
        this._calcRating = new CalcRating_1.CalcRating();
        this._userRatingInformation = new UserRatingInformationStrategy_1.UserRatingInformationStrategy(GameAPISingleton_1.GameAPISingleton.getTypeOfEnvironment());
    }
    saveRating(gameScoreboard) {
        let player1UserId = gameScoreboard.player1.webSocketUserSession.getUserId;
        let player2UserId = gameScoreboard.player2.webSocketUserSession.getUserId;
        let player1Rating = this._userRatingInformation.getUserRating(player1UserId);
        let player2Rating = this._userRatingInformation.getUserRating(player2UserId);
        let newRatings = this._calcRating.calculateRating(player1Rating, player2Rating, gameScoreboard);
        this._userRatingInformation.updateUserRating(player1UserId, newRatings[SaveRating.PLAYER_1]);
        this._userRatingInformation.updateUserRating(player1UserId, newRatings[SaveRating.PLAYER_2]);
    }
}
exports.SaveRating = SaveRating;
SaveRating.PLAYER_1 = 0;
SaveRating.PLAYER_2 = 0;
