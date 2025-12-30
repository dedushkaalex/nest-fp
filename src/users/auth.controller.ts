import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignInDto } from 'src/core/modules/iam/authentication/dto/sign-in.dto';
import { AuthenticationService } from 'src/core/modules/iam/authentication/authentication.service';
import { SignUpDto } from 'src/core/modules/iam/authentication/dto/sign-up.dto';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthenticationService<User>) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
