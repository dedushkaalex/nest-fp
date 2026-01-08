import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';
import { map } from 'rxjs';
import { isFunction } from 'rxjs/internal/util/isFunction';
import {
  AUTHENTICATION_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from './iam.constants';

@Injectable()
export class ApplyTokensInterceptor implements NestInterceptor {
  private readonly COOKIE_OPTIONS = {
    secure: false,
    httpOnly: true,
    path: '/',
  };

  intercept(context: ExecutionContext, next: CallHandler) {
    const res = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map(
        (
          data: TE.TaskEither<
            unknown,
            {
              tokens: {
                refreshToken: string;
                accessToken: string;
              };
            }
          >,
        ) => {
          if (!isFunction(data)) {
            return data;
          }

          return pipe(
            data,
            TE.map(({ tokens, ..._data }) => {
              res.cookie(
                AUTHENTICATION_COOKIE_NAME,
                tokens.accessToken,
                this.COOKIE_OPTIONS,
              );
              res.cookie(
                REFRESH_TOKEN_COOKIE_NAME,
                tokens.refreshToken,
                this.COOKIE_OPTIONS,
              );

              return _data;
            }),
          );
        },
      ),
    );
  }
}
