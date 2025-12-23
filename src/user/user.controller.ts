import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
/**
 * Написать простой контроллер на Nest.js + fp-ts который возьмет массив юзеров и превратит в массив UserResponse (юзер без password)
 */
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
