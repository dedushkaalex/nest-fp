import { ForbiddenError } from '@/core/lib/base-http-errors/errors';

import { AuthError } from '../enums/auth-error.enum';

export class UserAlreadyExists extends ForbiddenError<AuthError.USER_ALREADY_EXISTS> {
  constructor() {
    super(AuthError.USER_ALREADY_EXISTS);
  }
}
