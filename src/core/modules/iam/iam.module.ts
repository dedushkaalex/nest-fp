import { DynamicModule, Module } from '@nestjs/common';
import type { IIamModuleOptions } from './iam-options.interface';
import { AUTH_REPOSITORY_KEY, IAM_MODULE_OPTIONS_KEY } from './iam.constants';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationService } from './authentication/authentication.service';

@Module({})
export class IamModule {
  static forRoot(options: IIamModuleOptions): DynamicModule {
    const moduleOptions = {
      provide: IAM_MODULE_OPTIONS_KEY,
      useValue: options,
    };
    const typeOrmProvider = TypeOrmModule.forFeature([options.entity]);

    const userRepositoryProvider = {
      provide: AUTH_REPOSITORY_KEY,
      useFactory: (options: IIamModuleOptions, connection: DataSource) => {
        return connection.getRepository(options.entity);
      },
      inject: [IAM_MODULE_OPTIONS_KEY, DataSource],
    };

    return {
      module: IamModule,
      imports: [typeOrmProvider],
      providers: [userRepositoryProvider, moduleOptions, AuthenticationService],
      exports: [AuthenticationService],
    };
  }
}
