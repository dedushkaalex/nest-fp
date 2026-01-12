import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AUTHENTICATION_COOKIE_NAME } from './iam.constants';
import { ActiveUserData } from './interfaces/active-user-data.interface';
import {
  InjectJWTConfig,
  type JWTConfiguration,
} from 'src/shared/configs/jwt-config';

interface RequestWithUser extends Request {
  user: ActiveUserData;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    // @InjectJWTConfig() private readonly jwtConfiguration: JWTConfiguration,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenFromRequest(request);
    if (!token) {
      throw new UnauthorizedException('Invalid authentication token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<ActiveUserData>(token, {
        // secret: this.jwtConfiguration.secret,
        secret: 'sdasd',
      });
      request.user = payload;
    } catch {
      throw new UnauthorizedException('Invalid authentication token');
    }

    return true;
  }

  private extractTokenFromRequest(req: Request): string | undefined {
    return req.cookies?.[AUTHENTICATION_COOKIE_NAME];
  }
}
