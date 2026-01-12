import { ForbiddenError } from '@/core/lib/base-http-errors/errors';

import { AuthError } from '../enums/auth-error.enum';

export class CouldNotFindUser extends ForbiddenError<AuthError.COULD_NOT_FIND_USER> {
  constructor() {
    super(AuthError.COULD_NOT_FIND_USER);
  }
}
