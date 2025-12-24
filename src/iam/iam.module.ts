import { Module } from '@nestjs/common';
import { CryptoService } from './hashing/crypto.service';
import { HashingService } from './hashing/hashing.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';

@Module({
  providers: [
    {
      provide: HashingService,
      useClass: CryptoService,
    },
    AuthenticationService,
  ],
  controllers: [AuthenticationController],
})
export class IamModule {}
