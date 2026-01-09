export type BufferOrString = Buffer | string;

export abstract class CryptoService {
  abstract hash(password: string): Promise<string>;
  abstract compare(hash: BufferOrString, password: string): Promise<boolean>;
}
