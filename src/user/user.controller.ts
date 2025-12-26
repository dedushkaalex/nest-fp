import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entities';
import { AuthGuard } from 'src/iam/guards/auth.guard';
/**
 * Написать простой контроллер на Nest.js + fp-ts который возьмет массив юзеров и превратит в массив UserResponse (юзер без password)
 */

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('users')
  findAll() {
    return this.userService.findAll();
  }

  @Get('user/:email')
  getOne(@Param('email') email: string) {
    return this.userService.findOne(email);
  }
}
