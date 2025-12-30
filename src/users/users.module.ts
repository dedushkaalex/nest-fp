import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { IamModule } from 'src/core/modules/iam/iam.module';
import { User } from './entities/user.entity';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    IamModule.forRoot({
      entity: User,
      key: 'User',
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService],
})
export class UsersModule {}
