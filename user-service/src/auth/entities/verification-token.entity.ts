import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class VerificationToken {
  @PrimaryGeneratedColumn('uuid')
  ID: string;

  @Column()
  token: string;

  @Column()
  userID: string;

  @CreateDateColumn()
  createdAt: Date;
}
