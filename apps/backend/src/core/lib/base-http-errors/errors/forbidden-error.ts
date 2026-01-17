import { BaseError } from './base-error';
import { BaseErrorsType } from './types';

export class ForbiddenError<T extends string> extends BaseError {
  protected override readonly baseType = BaseErrorsType.FORBIDDEN;

  constructor(protected override readonly domainType: T) {
    super();
  }
}
