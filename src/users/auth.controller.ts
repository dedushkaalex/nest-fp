import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SignInDto } from 'src/core/modules/iam/authentication/dto/sign-in.dto';
import { SignUpDto } from 'src/core/modules/iam/authentication/dto/sign-up.dto';
import { UsersService } from './users.service';
import { RefreshTokenDto } from 'src/core/modules/iam/authentication/dto/refresh-token.dto';
import { AuthGuard } from 'src/core/modules/iam/auth.guard';
import { ActiveUserData } from 'src/core/modules/iam/interfaces/active-user-data.interface';
import type { Request, Response } from 'express';

interface RequestWithUser extends Request {
  user: ActiveUserData;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UsersService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.userService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.userService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.userService.refreshToken(refreshTokenDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('sign-out')
  async signOut(
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = this.userService.signOut(request.user);
    response.clearCookie('Authentication');
    response.clearCookie('RefreshAuthentication');
    return result;
  }
}
