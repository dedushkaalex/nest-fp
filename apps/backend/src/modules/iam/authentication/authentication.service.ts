import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AUTH_REPOSITORY_KEY } from '../iam.constants';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { AuthEntity } from './auth.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { dbErrors, isQueryFailedError } from 'src/core/helpers/typeorm-pg';
import { CryptoService } from 'src/core/lib/crypto/crypto.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { SignOutDto } from './dto/sign-out.dto';
import {
  InjectJWTConfig,
  type JWTConfiguration,
} from 'src/shared/configs/jwt-config';

@Injectable()
export class AuthenticationService<T extends AuthEntity> {
  constructor(
    @Inject(AUTH_REPOSITORY_KEY) private readonly userRepository: Repository<T>,
    private readonly cryptoService: CryptoService,
    @InjectJWTConfig() private readonly jwtConfiguration: JWTConfiguration,
    private readonly jwtService: JwtService,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  signIn(signInDto: SignInDto) {
    return pipe(
      this.findUserByEmail(signInDto.email),
      TE.bindTo('user'),
      TE.chainFirstW(({ user }) =>
        this.validatePassword(signInDto.password, user.password),
      ),
      TE.bindW('tokens', ({ user }) => this.generateTokens(user)),
      TE.map(({ user, tokens }) => ({ user, tokens })),
    );
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
      TE.bindW('tokens', ({ user }) => this.generateTokens(user)),
      TE.map(({ user, tokens }) => ({ user, tokens })),
    );
  }

  signOut(signOutDto: SignOutDto) {
    return TE.rightTask(() =>
      this.refreshTokenIdsStorage.invalidate(signOutDto.userId),
    );
  }

  private saveUser(user: T) {
    return TE.tryCatch(
      () => this.userRepository.save(user),
      (err) => {
        if (isQueryFailedError(err) && dbErrors.isUniqueViolation(err)) {
          return new ConflictException('Пользователь уже существует');
        }
        return new InternalServerErrorException(
          'Ошибка сохранения пользователя',
        );
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
      () => new UnauthorizedException('Неверный логин или пароль'),
    );
  }

  private findUserById(id: T['id']) {
    return TE.tryCatch(
      () =>
        this.userRepository.findOneByOrFail({
          id,
        } as FindOptionsWhere<T>),
      () => new NotFoundException('Пользователь не найден'),
    );
  }

  private generateTokens(user: T) {
    return TE.tryCatch(
      async () => {
        const jtiRefresh = randomUUID();

        const accessTokenTtl = this.jwtConfiguration.accessTokenTtl;

        const refreshTokenTtl = this.jwtConfiguration.refreshTokenTtl;

        const [accessToken, refreshToken] = await Promise.all([
          this.signToken(user.id, accessTokenTtl),
          this.signToken(user.id, refreshTokenTtl, { jti: jtiRefresh }),
        ]);

        await this.refreshTokenIdsStorage.insert(user.id, jtiRefresh);

        return { accessToken, refreshToken };
      },
      () =>
        new InternalServerErrorException(
          'Внутренняя ошибка сервера при генерации токенов',
        ),
    );
  }

  private signToken<P>(sub: T['id'], expiresIn: number, payload?: P) {
    return this.jwtService.signAsync(
      {
        sub,
        ...payload,
      },
      {
        expiresIn,
        secret: this.jwtConfiguration.secret,
      },
    );
  }

  private validatePassword(providedPassword: string, hashedPassword: string) {
    return pipe(
      TE.tryCatch(
        () => this.cryptoService.compare(providedPassword, hashedPassword),
        () => new UnauthorizedException('Неверный логин или пароль'),
      ),
      TE.chainW((isValid) =>
        isValid
          ? TE.right(true)
          : TE.left(new UnauthorizedException('Неверный логин или пароль')),
      ),
    );
  }

  refreshToken(refreshTokenDto: RefreshTokenDto) {
    console.log(refreshTokenDto);
    return pipe(
      TE.tryCatch(
        () =>
          this.jwtService.verifyAsync<ActiveUserData & { jti: string }>(
            refreshTokenDto.refreshToken,
            {
              secret: this.jwtConfiguration.secret,
            },
          ),
        () =>
          new UnauthorizedException('Refresh токен невалиден или просрочен'),
      ),
      TE.bindTo('refreshTokenPayload'),
      TE.bindW('user', ({ refreshTokenPayload }) =>
        pipe(
          this.findUserById(refreshTokenPayload.sub),
          TE.mapLeft(
            () => new UnauthorizedException('Пользователь из токена не найден'),
          ),
        ),
      ),
      TE.chainW(({ user, refreshTokenPayload }) =>
        TE.fromTask(async () => {
          const isValid = await this.refreshTokenIdsStorage.validate(
            user.id,
            refreshTokenPayload.jti,
          );

          if (!isValid) {
            return TE.left(
              new UnauthorizedException(
                'Refresh токен недействителен или был отозван',
              ),
            );
          }

          await this.refreshTokenIdsStorage.invalidate(user.id);

          return TE.right(user);
        }),
      ),
      TE.flattenW,
      TE.chainW((user) => this.generateTokens(user)),
      TE.map((tokens) => ({ tokens })),
    );
  }
}
