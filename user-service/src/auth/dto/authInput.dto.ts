import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// Reset Password Input
@InputType()
export class ResetPasswordInputDto {
  @Field()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

// Register User Input
@InputType()
export class RegisterUserInputDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  username: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

// Login User Input
@InputType()
export class LoginUserInputDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  username: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
