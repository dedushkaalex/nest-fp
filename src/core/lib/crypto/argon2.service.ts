import { Inject, Injectable } from '@nestjs/common';
import { CryptoService, type BufferOrString } from './crypto.service';
import * as argon2 from 'argon2';
import { type ICryptoModuleOptions } from './crypto.interface';
import { MODULE_OPTIONS_TOKEN } from './crypto.module-definition';

@Injectable()
export class Argon2Service implements CryptoService {
  private secret: Buffer = Buffer.of();

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) public readonly options: ICryptoModuleOptions,
  ) {
    this.secret = options.secret ? Buffer.from(options.secret) : this.secret;
  }

  compare(hash: BufferOrString, password: string): Promise<boolean> {
    return argon2.verify(password, hash);
  }

  hash(password: string): Promise<string> {
    return argon2.hash(password, { secret: this.secret });
  }
}
