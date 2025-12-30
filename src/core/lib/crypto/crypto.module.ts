import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './crypto.module-definition';
import { Argon2Service } from './argon2.service';
import { CryptoService } from './crypto.service';

@Module({
  providers: [
    Argon2Service,
    {
      provide: CryptoService,
      useClass: Argon2Service,
    },
  ],
  exports: [CryptoService],
})
export class Crypto extends ConfigurableModuleClass {}
