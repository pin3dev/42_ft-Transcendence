
export class AuthenticationMessage{

	private userToken: string = "";
	private userId: string = "";

	constructor(userToken: string, userId: string){
		this.userToken = userToken;
		this.userId = userId
	}

	get getUserToken(): string{
		return this.userToken;
	}

	set setUserToken(userToken : string){
		this.userToken = userToken;
	}

	get getUserId() : string {
		return this.userId;
	}

	set setUserId(userId : string){
		this.userId = userId;
	}
};
