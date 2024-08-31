import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { VerificationToken } from './entities/verification-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  LoginUserInputDto,
  RegisterUserInputDto,
  ResetPasswordInputDto,
} from './dto/authInput.dto';
import { ResetToken } from './entities/reset-token.entity';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private mailerService: MailerService,
    @InjectRepository(VerificationToken)
    private verificationTokenRepository: Repository<VerificationToken>,
    @InjectRepository(ResetToken)
    private resetTokenRepository: Repository<ResetToken>,
  ) {}

  async register(input: RegisterUserInputDto): Promise<void> {
    const user = await this.userService.create(input);

    const token = this.tokenService.signToken(user.ID);
    const verificationToken = this.verificationTokenRepository.create({
      token,
      userID: user.ID,
    });
    console.log(input);
    console.log(user);
    console.log(token);
    console.log(verificationToken);
    await this.verificationTokenRepository.save(verificationToken);

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Email Verification',
      text: `Hello ${user.username},\n\nPlease verify your email by using the following link: \n\n ${token}\n\nThank you!`,
    });
  }

  async login(input: LoginUserInputDto) {
    const user = await this.userService.validateUserPassword(
      input.username,
      input.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.tokenService.signAuthToken(user);
    return { token };
  }

  async verifyEmail(token: string): Promise<void> {
    const verificationToken = await this.verificationTokenRepository.findOne({
      where: { token },
    });
    if (!verificationToken) {
      throw new BadRequestException('Invalid token');
    }

    const user = await this.userService.findOne(verificationToken.userID);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isEmailVerified = true;
    await this.userService.update(user.ID, user);

    await this.verificationTokenRepository.delete(verificationToken.token);
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = this.tokenService.signToken(user.ID);
    const resetToken = this.resetTokenRepository.create({
      token,
      userID: user.ID,
    });
    await this.resetTokenRepository.save(resetToken);

    // Send the email with the token
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset',
      template: './password-reset', // The template file in mail templates folder
      text: `Hello ${user.username},\n\nYou can reset your password by clicking the following link: \n\n${process.env.FRONTEND_URL}/reset-password?token=${token}\n\nThank you!`,
    });
  }

  async resetPassword(
    token: string,
    input: ResetPasswordInputDto,
  ): Promise<void> {
    const resetToken = await this.resetTokenRepository.findOne({
      where: { token },
    });
    if (!resetToken) {
      throw new BadRequestException('Invalid token');
    }

    const user = await this.userService.findOne(resetToken.userID);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = input.password;
    await this.userService.update(user.ID, user);
    await this.resetTokenRepository.delete(resetToken.token);
  }
}
