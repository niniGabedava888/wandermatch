import { Trip } from 'src/trips/entities/trip.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

export enum InterestsStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity('interests')
@Unique(['senderId', 'receiverId'])
export class Interests {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receiverId' })
  receiver: User;

  @Column()
  receiverId: number;

  @Column()
  senderId: number;

  @Column({
    type: 'enum',
    enum: InterestsStatus,
    default: InterestsStatus.PENDING,
  })
  status: InterestsStatus;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Trip, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'tripId' })
  trip: Trip;

  @Column({ type: 'int', nullable: true, default: null })
  tripId: number | null;
}
