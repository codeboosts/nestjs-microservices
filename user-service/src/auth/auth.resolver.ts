import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  LoginUserInputDto,
  RegisterUserInputDto,
  ResetPasswordInputDto,
} from './dto/authInput.dto';
import { TokenOutputDto } from './dto/authOutput.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => String)
  async register(@Args('input') input: RegisterUserInputDto) {
    await this.authService.register(input);
    return 'check your email';
  }

  @Mutation(() => TokenOutputDto)
  async login(@Args('input') input: LoginUserInputDto) {
    return this.authService.login(input);
  }

  @Mutation(() => String)
  async requestPasswordReset(@Args('email') email: string) {
    await this.authService.requestPasswordReset(email);
    return 'check your email';
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Args('token') token: string,
    @Args('resetPasswordDto') resetPasswordDto: ResetPasswordInputDto,
  ): Promise<boolean> {
    await this.authService.resetPassword(token, resetPasswordDto);
    return true;
  }

  @Mutation(() => Boolean)
  async verifyEmail(@Args('token') token: string): Promise<boolean> {
    await this.authService.verifyEmail(token);
    return true;
  }
}
