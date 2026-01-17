import { BaseErrorsType } from './types';
import { BaseError } from './base-error';

export class Unauthorized<T extends string> extends BaseError {
  protected override readonly baseType = BaseErrorsType.UNAUTHORIZED;

  constructor(protected override readonly domainType?: T) {
    super();
  }
}
