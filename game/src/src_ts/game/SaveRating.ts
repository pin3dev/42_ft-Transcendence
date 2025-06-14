import { UserRatingInformation } from "../persistence/UserRatingInformation";
import { UserRatingInformationStrategy } from "../persistence/UserRatingInformationStrategy";
import { CalcRating } from "./CalcRating";
import { GameScoreboard } from "./GameScoreboard";

export class SaveRating {

	private static readonly PLAYER_1 = 0;
	private static readonly PLAYER_2 = 0;

	private _calcRating: CalcRating;
	private _userRatingInformation: UserRatingInformation;

	constructor() {
		this._calcRating = new CalcRating();
		this._userRatingInformation = new UserRatingInformationStrategy('test');
	}

	public saveRating(gameScoreboard: GameScoreboard): void {

		let player1UserId = gameScoreboard.player1.webSocketUserSession.getUserId;
		let player2UserId = gameScoreboard.player2.webSocketUserSession.getUserId;

		let player1Rating = this._userRatingInformation.getUserRating(player1UserId);
		let player2Rating = this._userRatingInformation.getUserRating(player2UserId);

		let newRatings: [number, number] = this._calcRating.calculateRating(player1Rating, player2Rating, gameScoreboard);

		this._userRatingInformation.updateUserRating(player1UserId, newRatings[SaveRating.PLAYER_1]);
		this._userRatingInformation.updateUserRating(player1UserId, newRatings[SaveRating.PLAYER_2]);
	}

}