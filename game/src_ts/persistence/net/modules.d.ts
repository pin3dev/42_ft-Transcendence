declare module "../../../pckg/redis/modules.js" {
  export function deleteCache(key: string): Promise<void>;
  export function setCache(key: string, value: string, ttl: number | null): Promise<void>;
  export function getCache(key: string): Promise<any>;
  export function publishEvent(type: string, payload: any): Promise<void>;
  export function subscribeToEvent(type: string, handler: (data: any) => void): void;
  export const EventTypes: Record<string, string>;
}
