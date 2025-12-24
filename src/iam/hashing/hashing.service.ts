import { Injectable } from '@nestjs/common';

type BufferOrString = Buffer | string;

@Injectable()
export abstract class HashingService {
  abstract hash(data: BufferOrString): Promise<string>;
  abstract compare(data: BufferOrString, encrypted: string): Promise<boolean>;
}
