declare module 'cache-manager-redis-store' {
  import { Store, Cache } from 'cache-manager';
  
  export interface RedisStore extends Store {
    name: 'redis';
    getClient(): any;
    isCacheableValue(value: any): boolean;
  }

  export function create(...args: any[]): RedisStore;
  export const redisStore: any;
}
