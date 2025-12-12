import { Injectable } from '@nestjs/common';
import { User, UserResponse } from './interfaces/user.interface';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import * as O from 'fp-ts/lib/Option';
import * as A from 'fp-ts/lib/Array';

@Injectable()
export class UserService {
  readonly users: User[] = [
    {
      id: 1,
      fullname: 'Иван Петров',
      email: 'ivan.petrov@example.com',
      number: '+7 (999) 123-45-67',
      password: '$2b$10$hashedpassword1',
    },
    {
      id: 2,
      fullname: 'Мария Сидорова',
      email: 'maria.sidorova@example.com',
      number: '+7 (999) 234-56-78',
      password: '$2b$10$hashedpassword2',
    },
    {
      id: 3,
      fullname: 'Алексей Иванов',
      email: 'alex.ivanov@example.com',
      number: '+7 (999) 345-67-89',
      password: '$2b$10$hashedpassword3',
    },
    {
      id: 4,
      fullname: 'Елена Козлова',
      email: 'elena.kozlova@example.com',
      number: '+7 (999) 456-78-90',
      password: '$2b$10$hashedpassword4',
    },
    {
      id: 5,
      fullname: 'Дмитрий Смирнов',
      email: 'dmitry.smirnov@example.com',
      number: '+7 (999) 567-89-01',
      password: '$2b$10$hashedpassword5',
    },
  ];

  findOne(id: string): TE.TaskEither<string, UserResponse> {
    return pipe(
      TE.of(this.users),
      TE.map(A.findFirst((user: User) => String(user.id) === String(id))),
      TE.chain(
        O.fold(
          () => TE.left('Пользователь не найден'),
          ({ password: _, ...user }) => TE.right(user),
        ),
      ),
    );
  }
}
