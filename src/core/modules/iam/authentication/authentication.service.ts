import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AUTH_REPOSITORY_KEY } from '../iam.constants';
import { BaseEntity, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { flow, pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { AuthEntity } from './auth.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { dbErrors, isQueryFailedError } from 'src/core/helpers/typeorm-pg';
import { CryptoService } from 'src/core/lib/crypto/crypto.service';

@Injectable()
export class AuthenticationService<T extends AuthEntity> {
  constructor(
    @Inject(AUTH_REPOSITORY_KEY) private readonly userRepository: Repository<T>,
    private readonly cryptoService: CryptoService,
  ) {}

  signIn(user: SignInDto) {
    return this.findUserByEmail(user.email);
  }

  //TODO: избавиться от as
  signUp(userSignUpDto: SignUpDto) {
    return pipe(
      this.createPassword(userSignUpDto.password),
      TE.bindTo('password'),
      TE.bindW('user', ({ password }) => {
        const newUser = this.userRepository.create({
          email: userSignUpDto.email,
          password,
        } as DeepPartial<T>);
        return this.saveUser(newUser);
      }),
      TE.map(({ user }) => user.email),
    );
  }

  private saveUser(user: T) {
    return TE.tryCatch(
      () => this.userRepository.save(user),
      (err) => {
        if (isQueryFailedError(err) && dbErrors.isUniqueViolation(err)) {
          return new ConflictException('Пользователь уже существует');
        }
      },
    );
  }

  private createPassword(password: string) {
    return TE.fromTask(() => this.cryptoService.hash(password));
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
