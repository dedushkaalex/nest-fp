import { BaseErrorsType } from './types';
import { BaseError } from './base-error';

export class RetryLaterError<T extends string> extends BaseError {
  protected override readonly baseType = BaseErrorsType.RETRY_LATER;

  constructor(protected override readonly domainType: T) {
    super();
  }
}
