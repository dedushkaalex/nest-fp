import { Inject, Injectable } from '@nestjs/common';
import { AuthenticationService } from '../iam/authentication/authentication.service';
import { User } from './entities/user.entity';
import { SignInDto } from '../iam/authentication/dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { RefreshTokenDto } from '../iam/authentication/dto/refresh-token.dto';
import { SignOutDto } from '../iam/authentication/dto/sign-out.dto';
import { Repository } from 'typeorm';
import { AUTH_REPOSITORY_KEY } from '../iam/iam.constants';

@Injectable()
export class UsersService {
  constructor(
    @Inject(AUTH_REPOSITORY_KEY)
    private userRepository: Repository<User>,
    private readonly authService: AuthenticationService<User>,
  ) {}

  signIn(signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  signUp(signUpDto: SignUpDto) {
    const newUser = this.userRepository.create({
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
    });
    return this.authService.signUp(signUpDto, newUser);
  }

  signOut(signOutDto: SignOutDto) {
    return this.authService.signOut(signOutDto);
  }

  refreshToken(refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
