import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getOrmConfigOptions } from '../shared/configs/typeorm';
import { IamModule } from '../iam/iam.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getOrmConfigOptions,
      inject: [ConfigService],
    }),

    UserModule,
    IamModule,
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
