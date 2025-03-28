import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get(key) {
    return await this.cache.get(key);
  }

  async set(key, value, ttl) {
    await this.cache.set(key, value, { ttl: ttl });
  }

  async del(key) {
    return await this.cache.del(key);
  }
}
