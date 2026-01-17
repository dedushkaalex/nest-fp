import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

import { Response } from 'express';
import { BaseError } from '../lib/base-http-errors/errors';
import { getHttpCodeByException } from '../lib/base-http-errors/base-exception-to-http';

@Catch(BaseError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: BaseError, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    const type = exception.getDomainType() ?? exception.getBaseType();
    const additional = exception.getAdditional();
    const code = getHttpCodeByException(exception);

    response.status(code).json({
      success: false,
      error: {
        type,
        additional,
      },
    });
  }
}
