import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entities';
import { IamModule } from 'src/iam/iam.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), IamModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
