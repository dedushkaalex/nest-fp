import { Unauthorized } from '@/core/lib/base-http-errors/errors';
import { AuthError } from '../enums/auth-error.enum';

export class InvalidCredentials extends Unauthorized<AuthError.INVALID_CREDENTIALS> {
  constructor() {
    super(AuthError.INVALID_CREDENTIALS);
  }
}
