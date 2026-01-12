import { SignUpDto as IamSignupDto } from '@/modules/iam/authentication/dto/sign-up.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class SignUpDto extends IamSignupDto {
  @ApiProperty({ example: 'Aleksey' })
  @IsNotEmpty({ message: 'Имя обязательно' })
  @Length(1, 100, { message: 'Имя от 1 до 100 символов' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Narodny' })
  @IsOptional()
  @Length(1, 100, { message: 'Имя от 1 до 100 символов' })
  @IsString()
  lastName: string;
}
