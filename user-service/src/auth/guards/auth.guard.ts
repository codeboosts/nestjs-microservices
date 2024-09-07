import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard as Pguard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends Pguard('jwt') {
  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
