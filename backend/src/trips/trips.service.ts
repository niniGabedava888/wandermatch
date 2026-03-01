import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './entities/trip.entity';
import { CreateTripDto } from './dto/create-trip.dto';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip) private tripRepository: Repository<Trip>,
  ) {}

  async create(userId: number, createTripDto: CreateTripDto) {
    const trip = this.tripRepository.create({ ...createTripDto, userId });
    await this.tripRepository.save(trip);
  }

  async delete(tripId: number, userId: number) {
    const trip = await this.tripRepository.findOne({
      where: { id: tripId },
    });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.userId !== userId) {
      throw new ForbiddenException('You can not delete this trip');
    }

    await this.tripRepository.delete(tripId);
    return { message: 'Trip deleted' };
  }

    async findMyTrips(userId: number) {
    return this.tripRepository.find({
      where: { userId },
      order: { startDate: 'ASC' }
    })
  }
}
