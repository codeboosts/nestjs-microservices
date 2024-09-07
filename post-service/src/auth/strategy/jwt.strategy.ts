import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import fetch from 'node-fetch';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private userServiceUrl: string;

  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'topSecret51',
    });

    this.userServiceUrl = this.configService.get<string>('USER_SERVICE_URL');
  }

  async validate(payload: AuthTokenPayload): Promise<CurrentUserType> {
    const { username } = payload;

    const query = `
      query GetUserByUsername($username: String!) {
        getUserByUsername(username: $username) {
          ID
        }
      }
    `;

    // Execute the GraphQL query using Fetch API
    const response = await fetch(this.userServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    const result = await response.json();
    const user = result.data.getUserByUsername;

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Return the user data with additional payload info
    return {
      ...payload,
      ID: user.ID,
    };
  }
}
