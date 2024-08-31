import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

@Entity('posts')
@ObjectType()
export class Post {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  ID: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column('text')
  content: string;

  @Field()
  @Column()
  imageUrl: string;

  @Field()
  @Column()
  userID: string;
}
