import { IsString } from 'class-validator';

import { Inject } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

export class CryptoEnvironmentVariables {
  @IsString()
  SECRET: string;
}

export const cryptoConfig = registerAs('crypto', () => ({
  secret: process.env.SECRET,
}));

export type CryptoConfiguration = ConfigType<typeof cryptoConfig>;

export const InjectCryptoConfig = () => Inject(cryptoConfig.KEY);
