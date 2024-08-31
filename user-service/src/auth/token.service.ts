import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  signAuthToken(user: User): string {
    const tokenUser: AuthTokenPayload = {
      username: user.username,
      role: user.role,
    };
    const token = this.jwtService.sign(tokenUser);
    return token;
  }

  signToken(userID: string): string {
    const token = this.jwtService.sign({ userID }, { expiresIn: '1h' });
    return token;
  }
}
