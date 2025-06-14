

export interface UserRatingInformation{

	getUserRating(userId : string) : number;

	updateUserRating(userId : string, newRatingValue : number) : void;

}