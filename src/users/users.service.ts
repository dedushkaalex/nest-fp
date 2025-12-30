import { Injectable } from '@nestjs/common';
import { AuthenticationService } from 'src/core/modules/iam/authentication/authentication.service';
import { User } from './entities/user.entity';
import { SignInDto } from 'src/core/modules/iam/authentication/dto/sign-in.dto';

@Injectable()
export class UsersService {
  constructor(private readonly authService: AuthenticationService<User>) {}

  signIn(user: SignInDto) {
    return this.authService.signIn(user);
  }
}
