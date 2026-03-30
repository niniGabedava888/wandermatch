import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Interests } from 'src/interests/entities/interests.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Interests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'interestId' })
  interest: Interests;

  @Column()
  interestId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column()
  senderId: number;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
