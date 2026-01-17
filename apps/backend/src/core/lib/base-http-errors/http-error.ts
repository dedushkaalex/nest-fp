import * as errors from './errors';

type ErrorTypes = typeof errors;

export type HTTPError = InstanceType<ErrorTypes[keyof ErrorTypes]>;
