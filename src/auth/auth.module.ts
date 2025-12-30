import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { IamModule } from 'src/core/modules/iam/iam.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    IamModule.forRoot({
      entity: User,
      key: 'User',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
