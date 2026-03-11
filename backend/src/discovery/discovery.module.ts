import { Module } from '@nestjs/common';
import { DiscoveryController } from './discovery.controller';
import { DiscoveryService } from './discovery.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from 'src/trips/entities/trip.entity';
import { User } from 'src/users/entities/user.entity';
import { InterestsModule } from 'src/interests/interests.module';
import { Interests } from 'src/interests/entities/interests.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, User, Interests]), InterestsModule],
  controllers: [DiscoveryController],
  providers: [DiscoveryService],
})
export class DiscoveryModule {}
