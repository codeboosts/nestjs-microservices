import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ResetToken {
  @PrimaryGeneratedColumn('uuid')
  ID: string;

  @Column()
  token: string;

  @Column()
  userID: string;

  @CreateDateColumn()
  createdAt: Date;
}
