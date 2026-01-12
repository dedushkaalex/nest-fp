import { BaseErrorsType } from './types';
import { BaseError } from './base-error';

export class UnknownError extends BaseError {
  override baseType = BaseErrorsType.UNKNOWN;

  constructor() {
    super();
  }
}
