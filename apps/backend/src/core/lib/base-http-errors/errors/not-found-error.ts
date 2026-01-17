import { BaseErrorsType } from './types';
import { BaseError } from './base-error';

export class NotFoundError<T extends string> extends BaseError {
  protected override readonly baseType = BaseErrorsType.NOT_FOUND;

  constructor(protected override readonly domainType: T) {
    super();
  }
}
