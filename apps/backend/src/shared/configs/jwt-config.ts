import { IsString, IsPositive, IsInt } from 'class-validator';

import { Inject } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

export class JWTEnvironmentVariables {
  @IsString()
  JWT_SECRET: string;

  @IsInt()
  @IsPositive()
  JWT_ACCESS_TOKEN_TTL: number;

  @IsInt()
  @IsPositive()
  JWT_REFRESH_TOKEN_TTL: number;
}

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  accessTokenTtl: Number.parseInt(
    process.env.JWT_ACCESS_TOKEN_TTL ?? '3600',
    10,
  ),
  refreshTokenTtl: Number.parseInt(
    process.env.JWT_REFRESH_TOKEN_TTL ?? '2592000',
    10,
  ),
}));

export type JWTConfiguration = ConfigType<typeof jwtConfig>;

export const InjectJWTConfig = () => Inject(jwtConfig.KEY);
