
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as E from 'fp-ts/lib/Either';
import { isFunction } from 'fp-ts/lib/function';

/**
 * Глобальный фильтр, который перехватывает ответы контроллеров.
 * Если ответ - это TaskEither (функция), он выполняет его и обрабатывает
 * результат (Left или Right), отправляя соответствующий HTTP-ответ.
 * В остальных случаях он делегирует обработку стандартным исключениям.
 */
@Catch()
export class FpTsExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(FpTsExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // 1. Проверяем, является ли "исключение" на самом деле функцией (наш TaskEither)
    if (isFunction(exception)) {
      try {
        const result = await exception(); // Выполняем TaskEither -> Promise<Either<L, R>>

        if (E.isLeft(result)) {
          // 2. Результат - Left. Формируем ответ об ошибке.
          // Для примера используем 404, но можно сделать и умнее.
          const status = HttpStatus.NOT_FOUND;
          const body = {
            statusCode: status,
            message: result.left, // Сообщение из Left
            error: 'Not Found',
          };
          httpAdapter.reply(response, body, status);
        } else {
          // 3. Результат - Right. Отправляем успешный ответ.
          httpAdapter.reply(response, result.right, HttpStatus.OK);
        }
      } catch (e) {
        // На случай, если при выполнении TaskEither произойдет другая ошибка
        this.logger.error('Error executing TaskEither', e.stack);
        const status = HttpStatus.INTERNAL_SERVER_ERROR;
        httpAdapter.reply(
          response,
          {
            statusCode: status,
            message: 'Internal Server Error while processing response',
          },
          status,
        );
      }
      return;
    }

    // 4. Если это не TaskEither, обрабатываем как обычное исключение
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody =
      exception instanceof HttpException
        ? exception.getResponse()
        : {
            statusCode: httpStatus,
            message: 'Internal Server Error',
          };

    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
