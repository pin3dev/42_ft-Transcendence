import { GameAPISingleton } from "../GameAPISingleton.js";
import { UserRatingInformationStrategy } from "../persistence/UserRatingInformationStrategy.js";
import { CalcRating } from "./CalcRating.js";
export class SaveRating {
    static PLAYER_1 = 0;
    static PLAYER_2 = 0;
    _calcRating;
    _userRatingInformation;
    constructor() {
        this._calcRating = new CalcRating();
        this._userRatingInformation = new UserRatingInformationStrategy(GameAPISingleton.getTypeOfEnvironment());
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
