import { AuthEntity } from './authentication/auth.entity';
import { AuthenticationService } from './authentication/authentication.service';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage';
import type { IIamModuleOptions } from './iam-options.interface';
import { AUTH_REPOSITORY_KEY, IAM_MODULE_OPTIONS_KEY } from './iam.constants';
import { Crypto } from '@/core/lib/crypto/crypto.module';
import { cryptoConfig } from '@/shared/configs/crypto-config';
import { jwtConfig } from '@/shared/configs/jwt-config';
import { redisConfig } from '@/shared/configs/redis-config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
@Module({})
export class IamModule {
  static forRoot<T extends AuthEntity>(
    options: IIamModuleOptions<T>,
  ): DynamicModule {
    const moduleOptions = {
      provide: IAM_MODULE_OPTIONS_KEY,
      useValue: options,
    };

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
      imports: [cryptoModule, typeOrmModule, redisModule, jwtModule],
      providers: [
        userRepositoryProvider,
        moduleOptions,
        AuthenticationService,
        RefreshTokenIdsStorage,
      ],
      exports: [
        AuthenticationService,
        RefreshTokenIdsStorage,
        jwtModule,
        userRepositoryProvider,
      ],
    };
  }
}
