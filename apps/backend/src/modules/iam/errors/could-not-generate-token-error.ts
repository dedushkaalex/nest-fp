import { ForbiddenError } from '@/core/lib/base-http-errors/errors';

import { AuthError } from '../enums/auth-error.enum';

export class CouldNotGenerateToken extends ForbiddenError<AuthError.COULD_NOT_GENERATE_TOKEN> {
  constructor() {
    super(AuthError.COULD_NOT_GENERATE_TOKEN);
  }
}
