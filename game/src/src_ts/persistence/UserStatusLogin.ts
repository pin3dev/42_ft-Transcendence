
export enum Status{
	ONLINE, OFFLINE
};

export interface UserStatusLogin {
	setUserStatus(userId : string, status : Status) : void;
}