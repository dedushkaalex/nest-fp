import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    try {
      const token = this.getToken(request);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const user = this.jwtService.verify(token);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/ban-ts-comment
      //@ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      request.user = user;
      return true;
    } catch (e) {
      return false;
    }
  }

  protected getToken(request: Request): string {
    const authorization = request.headers['authorization'];
    if (!authorization || Array.isArray(authorization)) {
      throw new Error('Invalid Authorization Header');
    }
    const [_, token] = authorization.split(' ');
    return token;
  }
}
