import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SignInDto } from '../iam/authentication/dto/sign-in.dto';

import { UsersService } from './users.service';
import { AuthGuard } from '../iam/auth.guard';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import type { Request } from 'express';
import { RemoveTokensInterceptor } from '../iam/remove-token.interceptor';
import { ApplyTokensInterceptor } from '../iam/apply-token.interceptor';
import { REFRESH_TOKEN_COOKIE_NAME } from '../iam/iam.constants';
import { SignUpDto } from './dto/sign-up.dto';

interface RequestWithUser extends Request {
  user: ActiveUserData;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UsersService) {}

  @UseInterceptors(ApplyTokensInterceptor)
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.userService.signUp(signUpDto);
  }

  @UseInterceptors(ApplyTokensInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.userService.signIn(signInDto);
  }

  @UseInterceptors(ApplyTokensInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  refreshToken(@Req() req: Request) {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME] as string;
    return this.userService.refreshToken({ refreshToken });
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('sign-out')
  @UseInterceptors(RemoveTokensInterceptor)
  async signOut(@Req() req: RequestWithUser) {
    return this.userService.signOut({ userId: req.user.sub });
  }
}
