import { Inject, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthenticationService } from 'src/core/modules/iam/authentication/authentication.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly authService: AuthenticationService<User>) {}
  signIn(user: SignInDto) {
    return this.authService.signIn(user);
  }
}
