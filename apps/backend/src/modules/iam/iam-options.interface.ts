import { Type } from '@nestjs/common';

export interface IIamModuleOptions<T> {
  key: string;
  entity: Type<T>;
}
