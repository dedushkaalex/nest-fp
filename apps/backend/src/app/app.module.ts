import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/modules/users/users.module';
import path from 'node:path';
import { validate } from 'src/shared/configs/environment.validation';
import {
  appConfig,
  AppEnvironmentVariables,
} from 'src/shared/configs/app-config';
import { typeOrmConfig } from 'src/shared/configs/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validate(AppEnvironmentVariables),
      load: [appConfig],
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
    AppService,
  ],
})
export class AppModule {}
