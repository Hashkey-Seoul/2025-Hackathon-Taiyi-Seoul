import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err) {
      throw err;
    }
    if (!user) {
      switch (info?.name) {
        case 'TokenExpiredError':
          throw new HttpException('토큰이 만료되었습니다.', 410);
        case 'JsonWebTokenError':
          throw new HttpException(
            `유효하지 않은 토큰입니다. ${info.message}`,
            401,
          );
        case 'NotBeforeError':
          throw new HttpException('JWT가 활성화되지 않았습니다.', 406);
        case 'Error':
          throw new HttpException(info.message, 401);
        default:
          throw new HttpException('알수없는 형식의 JWT 에러', 500);
      }
    }
    return user;
  }
}
