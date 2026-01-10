import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'alex@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678QWE' })
  @MinLength(8)
  password: string;
}
