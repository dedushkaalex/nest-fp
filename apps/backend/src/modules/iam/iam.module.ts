import { validate } from 'src/shared/configs/environment.validation';
import { DynamicModule, Module } from '@nestjs/common';
import type { IIamModuleOptions } from './iam-options.interface';
import { AUTH_REPOSITORY_KEY, IAM_MODULE_OPTIONS_KEY } from './iam.constants';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationService } from './authentication/authentication.service';
import { Crypto } from 'src/core/lib/crypto/crypto.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage';
import {
  jwtConfig,
  JWTEnvironmentVariables,
} from 'src/shared/configs/jwt-config';
import path from 'path';
import { AuthGuard } from './auth.guard';
import { AuthEntity } from './authentication/auth.entity';
import {
  cryptoConfig,
  CryptoEnvironmentVariables,
} from 'src/shared/configs/crypto-config';
import {
  redisConfig,
  RedisEnvironmentVariables,
} from 'src/shared/configs/redis-config';
import { APP_GUARD } from '@nestjs/core';

@Module({})
export class IamModule {
  static forRoot<T extends AuthEntity>(
    options: IIamModuleOptions<T>,
  ): DynamicModule {
    const moduleOptions = {
      provide: IAM_MODULE_OPTIONS_KEY,
      useValue: options,
    };

    const configModule = ConfigModule.forRoot({
      envFilePath: [path.join(process.cwd(), '../..', '.env')],
      validate: validate(
        JWTEnvironmentVariables,
        CryptoEnvironmentVariables,
        RedisEnvironmentVariables,
      ),
      load: [jwtConfig, cryptoConfig, redisConfig],
    });
    const cryptoModule = Crypto.forRootAsync(cryptoConfig.asProvider());

    const typeOrmModule = TypeOrmModule.forFeature([options.entity]);

    const redisModule = RedisModule.forRootAsync(redisConfig.asProvider());

    const jwtModule = JwtModule.registerAsync(jwtConfig.asProvider());

    const userRepositoryProvider = {
      provide: AUTH_REPOSITORY_KEY,
      useFactory: (options: IIamModuleOptions<T>, connection: DataSource) => {
        return connection.getRepository(options.entity);
      },
      inject: [IAM_MODULE_OPTIONS_KEY, DataSource],
    };

    return {
      module: IamModule,
      imports: [
        cryptoModule,
        configModule,
        typeOrmModule,
        redisModule,
        jwtModule,
      ],
      providers: [
        userRepositoryProvider,
        moduleOptions,
        AuthenticationService,
        RefreshTokenIdsStorage,
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
      ],
      exports: [AuthenticationService, RefreshTokenIdsStorage, jwtModule],
    };
  }
}
