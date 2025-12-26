import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IUser, IUserResponse } from './interfaces/user.interface';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import * as O from 'fp-ts/lib/Option';
import * as A from 'fp-ts/lib/Array';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entities';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  findOne(email: string) {
    return TE.tryCatch(
      () => this.userRepository.findOneByOrFail({ email }),
      () => new NotFoundException('Пользователь не найден'),
    );
  }

  findAll() {
    return TE.tryCatch(
      () => this.userRepository.find(),
      (error: unknown) =>
        new InternalServerErrorException(
          'Ошибка при поиске пользователей',
          error?.toString(),
        ),
    );
  }
}
