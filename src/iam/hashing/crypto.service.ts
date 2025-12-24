import { Injectable } from '@nestjs/common';
import { HashingService } from './hashing.service';
import * as argon2 from 'argon2';

@Injectable()
export class CryptoService implements HashingService {
  private salt: Buffer = Buffer.from('string_hash');

  hash(data: string | Buffer): Promise<string> {
    return argon2.hash(data, { salt: this.salt });
  }

  compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return argon2.verify(encrypted, data);
  }
}
