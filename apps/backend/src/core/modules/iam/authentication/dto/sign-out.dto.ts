import { ApiProperty } from '@nestjs/swagger';

export class SignOutDto {
  @ApiProperty()
  userId: number;
}
