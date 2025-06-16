declare module 'redis/modules.js' {
	export function deleteCache(key: string): Promise<void>;
	export function setCache(key: string, value: string, ttl: number | null): Promise<void>;
	export function getCache(key: string): Promise<any>;
	export function publishEvent(type: string, payload: any): Promise<void>;
	export function subscribeToEvent(type: string, handler: (data: any) => void): void;

	export const EventTypes: {
		USER_REGISTERED: "user.registered";
		USER_DELETED: "user.deleted";
		MATCH_FINISHED: "match.finished";
		TOURNAMENT_CREATED: "tournament.created";
	};
}
