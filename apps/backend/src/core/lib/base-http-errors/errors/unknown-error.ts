import { BaseErrorsType } from './types';
import { BaseError } from './base-error';

export class UnknownError extends BaseError {
  protected override readonly baseType = BaseErrorsType.UNKNOWN;

  constructor() {
    super();
  }
}
