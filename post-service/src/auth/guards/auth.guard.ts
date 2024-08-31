import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard as Pguard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends Pguard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
