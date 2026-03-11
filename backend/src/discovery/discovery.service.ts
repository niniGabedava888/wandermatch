import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from 'src/trips/entities/trip.entity';
import { DiscoveryQueryDto } from './dto/discover-query.dto';
import { DiscoverResultDto } from './dto/discover-result.dto';

@Injectable()
export class DiscoveryService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) {}

  async findTravellers(currentUserId: number, query: DiscoveryQueryDto) {
    const qb = this.tripRepository
      .createQueryBuilder('trip')
      .innerJoinAndSelect('trip.user', 'user')
      .where('trip.userId != :currentUserId', { currentUserId })
      .andWhere('LOWER(trip.city) = LOWER(:city)', { city: query.city });

    if (query.country) {
      qb.andWhere('LOWER(trip.country) = LOWER(:country)', {
        country: query.country,
      });
    }

    // Layer 3 — optional date overlap
    if (query.startDate && query.endDate) {
      qb.andWhere('trip.startDate <= :endDate', { endDate: query.endDate });
      qb.andWhere('trip.endDate >= :startDate', { startDate: query.startDate });
    }

    // Layer 4 — optional travel style
    if (query.travelStyle) {
      qb.andWhere('user.travelStyle = :travelStyle', {
        travelStyle: query.travelStyle,
      });
    }

    // Layer 5 — left join interests to get status
    qb.leftJoinAndSelect(
      'user.sentInterests', // ← needs relation on User entity
      'interest',
      'interest.receiverId = :currentUserId', // interests THIS user received FROM results
      { currentUserId },
    );

    const trips = await qb.getMany();

    // map to DTO
    return trips.map((trip) => {
      const result = new DiscoverResultDto();
      result.id = trip.user.id;
      result.name = trip.user.name;
      result.bio = trip.user.bio;
      result.travelStyle = trip.user.travelStyle;
      result.interests = trip.user.interests;
      result.languages = trip.user.languages;
      result.profilePhoto = trip.user.profilePhoto ?? null;
      result.matchingTrip = {
        city: trip.city,
        country: trip.country,
        startDate: trip.startDate,
        endDate: trip.endDate,
      };
      result.interestStatus = trip.user.sentInterests?.[0]?.status ?? null;
      return result;
    });
  }
}
