import { NetUserRatingInformation } from "./net/NetUserRatingInformation";
import { TestUserRatingInformation } from "./test/TestUserRatingInformation";
import { UserRatingInformation } from "./UserRatingInformation";

export class UserRatingInformationStrategy implements UserRatingInformation {

	private _userRatingInformation: UserRatingInformation;

	constructor(typeOfEnvironment: string) {
		if (typeOfEnvironment === 'test') {
			this._userRatingInformation = new TestUserRatingInformation();
		} else {
			this._userRatingInformation = new NetUserRatingInformation();
		}
	}

	getUserRating(userId: string): number {
		return this._userRatingInformation.getUserRating(userId);
	}

	updateUserRating(userId: string, newRatingValue: number): void {
		return this._userRatingInformation.updateUserRating(userId, newRatingValue);
	}

}