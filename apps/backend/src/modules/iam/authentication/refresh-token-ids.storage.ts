import { Injectable } from '@nestjs/common';
import { RedisService, DEFAULT_REDIS } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

import {
  InjectJWTConfig,
  type JWTConfiguration,
} from 'src/shared/configs/jwt-config';

@Injectable()
export class RefreshTokenIdsStorage {
  private readonly redis: Redis;
  constructor(
    @InjectJWTConfig()
    private readonly jwtConfiguration: JWTConfiguration,
    private readonly redisService: RedisService,
  ) {
    this.redis = this.redisService.getOrThrow(DEFAULT_REDIS);
  }

  async insert(userId: number, tokenId: string): Promise<void> {
    const key = this.getKey(userId);
    const refreshTokenTtl = this.jwtConfiguration.refreshTokenTtl;

    await this.redis.sadd(key, tokenId);
    await this.redis.expire(key, refreshTokenTtl);
  }

  async validate(userId: number, tokenId: string): Promise<boolean> {
    const key = this.getKey(userId);

    const isMember = await this.redis.sismember(key, tokenId);
    return isMember === 1;
  }

  async invalidate(userId: number) {
    await this.redis.del(this.getKey(userId));
  }

  private getKey(userId: number): string {
    return `user-${userId}-rt-ids`;
  }
}
