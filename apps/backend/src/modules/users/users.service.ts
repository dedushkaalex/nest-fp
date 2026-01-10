import { Injectable } from '@nestjs/common';
import { AuthenticationService } from '../iam/authentication/authentication.service';
import { User } from './entities/user.entity';
import { SignInDto } from '../iam/authentication/dto/sign-in.dto';
import { SignUpDto } from '../iam/authentication/dto/sign-up.dto';
import { RefreshTokenDto } from '../iam/authentication/dto/refresh-token.dto';
import { SignOutDto } from '../iam/authentication/dto/sign-out.dto';

@Injectable()
export class UsersService {
  constructor(private readonly authService: AuthenticationService<User>) {}

  signIn(signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  signUp(signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  signOut(signOutDto: SignOutDto) {
    return this.authService.signOut(signOutDto);
  }

  refreshToken(refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
