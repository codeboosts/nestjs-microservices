import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'topSecret51',
    });
  }

  async validate(payload: AuthTokenPayload): Promise<CurrentUserType> {
    // TODO: will check is user exist in DB
    // const user = await this.userService.findOneByUsername(username);

    // if (!user) {
    //   throw new UnauthorizedException();
    // }

    return {
      ...payload,
      ID: '',
    };
  }
}
