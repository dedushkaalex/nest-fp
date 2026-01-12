import { BaseError } from './base-error';
import { BaseErrorsType } from './types';

export class ForbiddenError<T extends string> extends BaseError {
  override baseType = BaseErrorsType.FORBIDDEN;

  constructor(protected override readonly domainType: T) {
    super();
  }
}
