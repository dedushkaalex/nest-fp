import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AUTH_REPOSITORY_KEY } from '../iam.constants';
import { BaseEntity, FindOptionsWhere, Repository } from 'typeorm';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { AuthEntity } from './auth.entity';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthenticationService<T extends AuthEntity> {
  constructor(
    @Inject(AUTH_REPOSITORY_KEY) private readonly userRepository: Repository<T>,
  ) {}

  signIn(user: SignInDto) {
    return this.findUserByEmail(user.email);
  }

  signUp(userSignUpDto: SignUpDto) {}

  private saveUser(user: T) {
    return TE.tryCatch(
      () => this.userRepository.save(user),
      (err) => {
        // if (err.code)
        // todo: тут проверю на ошибку постгре
      },
    );
  }

  private findUserByEmail(email: T['email']) {
    return TE.tryCatch(
      () => {
        return this.userRepository.findOneByOrFail({
          email,
        } as FindOptionsWhere<T>);
      },
      () => new UnauthorizedException('Пользователь не существует'),
    );
  }
}
