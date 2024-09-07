import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { TokenService } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetToken } from './entities/reset-token.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import { VerificationToken } from './entities/verification-token.entity';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'topSecret51',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([ResetToken, VerificationToken]),
    UserModule,
    PassportModule,
  ],
  providers: [AuthResolver, AuthService, TokenService, JwtStrategy],
})
export class AuthModule {}
