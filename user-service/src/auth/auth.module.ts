import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { TokenService } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetToken } from './entities/reset-token.entity';
import { VerificationToken } from './entities/verification-token.entity';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([ResetToken, VerificationToken]),
    UserModule,
  ],
  providers: [AuthResolver, AuthService, TokenService],
})
export class AuthModule {}
