import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/modules/users/users.module';
import path from 'node:path';
import { validate } from '@/shared/configs/environment.validation';
import {
  appConfig,
  AppEnvironmentVariables,
} from '@/shared/configs/app-config';
import { typeOrmConfig } from '@/shared/configs/typeorm.config';
import {
  cryptoConfig,
  CryptoEnvironmentVariables,
} from '@/shared/configs/crypto-config';
import {
  jwtConfig,
  JWTEnvironmentVariables,
} from '@/shared/configs/jwt-config';
import {
  redisConfig,
  RedisEnvironmentVariables,
} from '@/shared/configs/redis-config';
import { DomainExceptionFilter } from '@/core/filters/domain-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validate(
        AppEnvironmentVariables,
        JWTEnvironmentVariables,
        CryptoEnvironmentVariables,
        RedisEnvironmentVariables,
      ),
      load: [appConfig, typeOrmConfig, jwtConfig, cryptoConfig, redisConfig],
      envFilePath: [path.join(process.cwd(), '../..', '.env')],
      cache: true,
      isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig.asProvider()),
    UsersModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule {}
