import { UserRatingInformation } from "../UserRatingInformation";

export class NetUserRatingInformation implements UserRatingInformation {

	getUserRating(userId: string): number {
		return 1000;
	}

	updateUserRating(userId: string, newRatingValue : number): void {

	}
}