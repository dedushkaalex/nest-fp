/* eslint-disable @typescript-eslint/no-unsafe-return */
/**
 * При помощи интерцепторов мы из контроллера можем возвращать не только промис,
 * но и что-то другое, и что-то другое потом возвращать Promise. Можем перехватить результат контроллера
 */

import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { from, map, mergeMap, Observable, of } from 'rxjs';
import { isFunction } from 'rxjs/internal/util/isFunction';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';

export type HttpExceptionEither<T> =
  | E.Either<HttpException, T>
  | TE.TaskEither<HttpException, T>;

@Injectable()
export class EitherInterceptor implements NestInterceptor {
  intercept<T>(
    _context: ExecutionContext,
    next: CallHandler<HttpExceptionEither<T>>,
  ): Observable<any> {
    return next
      .handle()
      .pipe(
        mergeMap((response) => {
          if (isFunction(response)) {
            return from(response());
          }
          return of(response);
        }),
      )
      .pipe(
        map((response) => {
          if (E.isLeft(response)) {
            throw response.left;
          }

          if (E.isRight(response)) {
            return response.right;
          }

          return response;
        }),
      );
  }
}
