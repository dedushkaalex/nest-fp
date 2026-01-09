import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';

export const getRedisConfig = (
  configService: ConfigService,
): RedisModuleOptions => ({
  config: {
    host: configService.getOrThrow<string>('REDIS_HOST'),
    port: parseInt(configService.getOrThrow<string>('REDIS_PORT'), 10),
  },
});
