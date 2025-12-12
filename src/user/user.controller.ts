import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';

/**
 * Написать простой контроллер на Nest.js + fp-ts который возьмет массив юзеров и превратит в массив UserResponse (юзер без password)
 */
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return pipe(
      this.userService.findOne(id),
      TE.match(
        (error) => {
          throw new NotFoundException(error);
        },
        (user) => user,
      ),
    )();
  }
}
