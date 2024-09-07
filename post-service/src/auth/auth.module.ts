import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'topSecret51', // You may want to move this to ConfigService for security
      signOptions: { expiresIn: '1h' }, // Optional
    }),
  ],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
