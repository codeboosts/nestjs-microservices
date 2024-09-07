import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { onHashPassword } from 'src/utils/bcrypt';

@Entity()
@ObjectType()
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  ID: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  password: string;

  @Field()
  @Column({ default: 'user' })
  role: string;

  @Field(() => Boolean)
  @Column({ default: false })
  isEmailVerified: boolean;

  @BeforeInsert()
  async hashPassword() {
    this.password = onHashPassword(this.password);
  }
}
