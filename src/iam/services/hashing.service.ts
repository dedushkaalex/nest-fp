import { Inject, Injectable, Logger } from '@nestjs/common';
import * as argon2 from 'argon2';
import hashingConfig from '../config/hashing.config';
import { type ConfigType } from '@nestjs/config';

type BufferOrString = string | Buffer;

export abstract class HashingService {
  abstract hash(data: BufferOrString): Promise<string>;
  abstract compare(data: BufferOrString, encrypted: string): Promise<boolean>;
}

@Injectable()
export class Argon2HashingService implements HashingService {
  salt: Buffer = Buffer.from('salt_default+!!!');

  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(hashingConfig.KEY)
    public readonly config: ConfigType<typeof hashingConfig>,
  ) {
    this.salt = config.salt ? Buffer.from(config.salt) : this.salt;

    if (!this.salt) {
      this.logger.warn(`No salt provided. This is not recommended.`);
    }
  }

  compare(data: BufferOrString, encrypted: string): Promise<boolean> {
    return argon2.verify(encrypted, data, { secret: Buffer.from(this.salt) });
  }

  hash(data: BufferOrString): Promise<string> {
    return argon2.hash(data, { secret: Buffer.from(this.salt) });
  }
}
