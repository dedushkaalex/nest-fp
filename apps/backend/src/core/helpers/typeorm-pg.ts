import { PostgresError } from 'pg-error-enum';
import type { DatabaseError } from 'pg-protocol';
import { QueryFailedError } from 'typeorm';

export const isQueryFailedError = (
  error: unknown,
): error is QueryFailedError & DatabaseError =>
  error instanceof QueryFailedError;

const isUniqueViolation = (
  error: QueryFailedError & DatabaseError,
): error is QueryFailedError & DatabaseError =>
  error?.code === String(PostgresError.UNIQUE_VIOLATION);

export const dbErrors = {
  isUniqueViolation,
};
