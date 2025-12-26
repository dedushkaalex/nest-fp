import { Module } from '@nestjs/common';
import {
  Argon2HashingService,
  HashingService,
} from './services/hashing.service';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import hashingConfig from './config/hashing.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entities';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(hashingConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AuthenticationController],
  providers: [
    { provide: HashingService, useClass: Argon2HashingService },
    AuthenticationService,
    AuthGuard,
  ],
  exports: [HashingService, AuthenticationService, JwtModule],
})
export class IamModule {}
