import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Like JwtAuthGuard, but never throws if there's no token or the token is
 * invalid — it simply leaves req.user as undefined.
 * Use this on routes that should work for both guests AND logged-in users.
 */
@Injectable()
export class JwtOptionalAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // Override handleRequest so we don't throw on missing/invalid tokens
  handleRequest<TUser = any>(_err: any, user: TUser): TUser {
    // Simply return the user (or undefined) — never throw
    return user;
  }
}
