import { UserRatingInformation } from "../UserRatingInformation";


export class TestUserRatingInformation implements UserRatingInformation {

	getUserRating(userId: string): number {
		return 1000;
	}

	updateUserRating(userId: string, newRatingValue : number): void {

	}
}