import { ConfigService } from '@nestjs/config';

export interface Env {
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
}

declare module '@nestjs/config' {
  interface ConfigService {
    getOrThrow<K extends keyof Env>(
      key: K,
      options?: { infer?: boolean },
    ): Env[K];

    getOrThrow(key: string, options?: { infer?: boolean }): unknown;
  }
}
