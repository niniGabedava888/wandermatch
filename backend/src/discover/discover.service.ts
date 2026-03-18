import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Trip } from 'src/trips/entities/trip.entity';
import { DiscoveryQueryDto } from './dto/discover-query.dto';
import { DiscoverResultDto } from './dto/discover-result.dto';
import { Interests } from 'src/interests/entities/interests.entity';

@Injectable()
export class DiscoverService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    @InjectRepository(Interests)
    private readonly interestsRepository: Repository<Interests>,
  ) {}

  async findTravellers(currentUserId: number, query: DiscoveryQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    const qb = this.tripRepository
      .createQueryBuilder('trip')
      .innerJoinAndSelect('trip.user', 'user')
      .where('trip.userId != :currentUserId', { currentUserId });

    if (query.city) {
      qb.andWhere('LOWER(trip.city) = LOWER(:city)', {
        city: query.city,
      });
    }

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

    qb.orderBy('trip.startDate', 'ASC');

    const total = await qb.getCount();

    // apply pagination
    qb.skip(skip).take(limit);

    const trips = await qb.getMany();

    const resultUserIds = trips.map((t) => t.user.id);

    const sentInterests =
      resultUserIds.length > 0
        ? await this.interestsRepository.find({
            where: {
              senderId: currentUserId,
              receiverId: In(resultUserIds), // import In from typeorm
            },
          })
        : [];

    // map to DTO
    const data = trips.map((trip) => {
      const interest = sentInterests.find((i) => i.receiverId === trip.user.id);
      const result = new DiscoverResultDto();
      result.id = trip.user.id;
      result.name = trip.user.name;
      result.bio = trip.user.bio;
      result.travelStyle = trip.user.travelStyle;
      result.interests = trip.user.interests;
      result.languages = trip.user.languages;
      result.profilePhoto = trip.user.profilePhoto ?? null;
      result.matchingTrip = {
        id: trip.id,
        city: trip.city,
        country: trip.country,
        startDate: trip.startDate,
        endDate: trip.endDate,
      };
      result.interestStatus = interest?.status ?? null;
      result.interestId = interest?.id ?? null;
      return result;
    });

    // return data + pagination metadata
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }
}
