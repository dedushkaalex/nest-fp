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
export class RemoveTokensInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const res = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data: TE.TaskEither<unknown, void>) => {
        if (!isFunction(data)) {
          return data;
        }

        return pipe(
          data,
          TE.tap(() => {
            res.clearCookie(AUTHENTICATION_COOKIE_NAME);
            res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);

            return TE.right(undefined);
          }),
        );
      }),
    );
  }
}
