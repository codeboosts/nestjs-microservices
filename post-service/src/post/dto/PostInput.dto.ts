import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

@InputType()
export class CreatePostInputDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  title: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  content: string;

  @IsOptional()
  @IsUrl()
  @Field()
  imageUrl: string;
}

@InputType()
export class UpdatePostInputDto {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  title: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  content: string;

  @IsOptional()
  @IsUrl()
  @Field({ nullable: true })
  imageUrl: string;
}
