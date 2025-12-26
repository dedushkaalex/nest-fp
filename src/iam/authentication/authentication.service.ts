import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entities';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import { HashingService } from '../services/hashing.service';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  signUp(signUpDto: SignUpDto) {
    return pipe(
      this.createPassword(signUpDto.password),
      TE.bindTo('password'),
      TE.bindW('user', ({ password }) =>
        this.saveUser({ ...signUpDto, password }),
      ),
    );
  }

  signIn(signInDto: SignInDto) {
    return pipe(
      this.findUserByEmail(signInDto.email),
      TE.mapLeft(() => new ConflictException('Invalid credentionals')),
      TE.chainFirstW((user) =>
        this.validatePassword(signInDto.password, user.password),
      ),
      TE.chainW((user) => this.generateTokens(user)),
    );
  }

  private createPassword(password: string) {
    return TE.fromTask(() => this.hashingService.hash(password));
  }

  private saveUser(user: SignUpDto) {
    return pipe(
      TE.tryCatch(
        () => this.userRepository.save(user),
        (e: unknown) => {
          const pgUniqueViolationErrorCode = '23505';

          if (
            typeof e === 'object' &&
            e !== null &&
            'code' in e &&
            (e as { code: unknown }).code === pgUniqueViolationErrorCode
          ) {
            return new ConflictException(
              'User with this email already exists.',
            );
          }

          return e;
        },
      ),
    );
  }

  private findUserByEmail(email: string) {
    return pipe(
      TE.tryCatch(
        () => this.userRepository.findOneByOrFail({ email }),
        () => new UnauthorizedException('Could not find user'),
      ),
    );
  }

  private validatePassword(hashedPassword: string, providedPassword: string) {
    return pipe(
      TE.tryCatch(
        () => this.hashingService.compare(hashedPassword, providedPassword),
        () => new UnauthorizedException('Invalid credentionals'),
      ),
      TE.chain((isValid) =>
        isValid
          ? TE.right(true)
          : TE.left(new UnauthorizedException('Invalid credentionals')),
      ),
    );
  }

  private generateTokens(user: User) {
    return TE.tryCatch(
      async () => {
        const accessToken = await this.jwtService.signAsync({
          sub: user.id,
          email: user.email,
        });

        return { accessToken };
      },
      (err) =>
        new UnauthorizedException('Could not generate token', { cause: err }),
    );
  }
}
