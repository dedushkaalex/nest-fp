import { Unauthorized } from '@/core/lib/base-http-errors/errors';

import { AuthError } from '../enums/auth-error.enum';

export class InvalidAccessToken extends Unauthorized<AuthError.INVALID_ACCESS_TOKEN> {
  constructor() {
    super(AuthError.INVALID_ACCESS_TOKEN);
  }
}
