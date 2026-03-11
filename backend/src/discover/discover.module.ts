import { Module } from '@nestjs/common';
import { DiscoverController } from './discover.controller';
import { DiscoverService } from './discover.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from 'src/trips/entities/trip.entity';
import { User } from 'src/users/entities/user.entity';
import { InterestsModule } from 'src/interests/interests.module';
import { Interests } from 'src/interests/entities/interests.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, User, Interests]), InterestsModule],
  controllers: [DiscoverController],
  providers: [DiscoverService],
})
export class DiscoverModule {}
