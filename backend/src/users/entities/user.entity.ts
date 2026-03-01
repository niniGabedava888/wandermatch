import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Trip } from '../../trips/entities/trip.entity';

export enum TravelStyle {
  ADVENTUROUS = 'adventurous',
  RELAXED = 'relaxed',
  CULTURAL = 'cultural',
  BUDGET = 'budget',
  LUXURY = 'luxury',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
  }

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  nationality: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  profilePhoto: string;

  @Column({ type: 'enum', enum: TravelStyle, nullable: true })
  travelStyle: TravelStyle;

  @Column('text', { array: true, default: '{}' })
  interests: string[];

  @Column('text', { array: true, default: '{}' })
  languages: string[];

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Trip, (trip) => trip.user)
  trips: Trip[];
}
