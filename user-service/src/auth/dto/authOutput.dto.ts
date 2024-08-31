import { Field, ObjectType } from '@nestjs/graphql';

// Reset Password Input
@ObjectType()
export class TokenOutputDto {
  @Field()
  token: string;
}
