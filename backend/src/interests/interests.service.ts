import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Interests, InterestsStatus } from './entities/interests.entity';
import { Repository } from 'typeorm';
import { CreateInterestDto } from './dto/create-interest.dto';
import { RespondInterestDto } from './dto/respond-interest.dto';

@Injectable()
export class InterestsService {
  constructor(
    @InjectRepository(Interests)
    private interestsRepository: Repository<Interests>
  ) {}

  async send(senderId: number, dto: CreateInterestDto) {
    if (senderId === dto.receiverId)
      throw new BadRequestException('You can not send interest to yourself!');

    const existingInterest = await this.interestsRepository.findOne({
      where: { senderId, receiverId: dto.receiverId },
    });

    if (existingInterest) {
      throw new ConflictException('You have already sent interest to this user!');
    }

    const interest = this.interestsRepository.create({
      senderId,
      receiverId: dto.receiverId,
      tripId: dto.tripId,
      status: InterestsStatus.PENDING,
    });

    return this.interestsRepository.save(interest);
  }

  async getReceived(userId: number) {
    const interests = await this.interestsRepository.find({
      where: { receiverId: userId },
      relations: ['sender', 'trip'],
      order: { createdAt: 'DESC' },
    });
    return interests;
  }

  async getSent(userId: number) {
    const interests = await this.interestsRepository.find({
      where: { senderId: userId },
      relations: ['receiver', 'trip'],
      order: { createdAt: 'DESC' },
    });

    return interests;
  }

  async respond(interstId: number, userId: number, dto: RespondInterestDto) {
    const interest = await this.interestsRepository.findOne({
      where: { id: interstId },
    });

    if (!interest) throw new NotFoundException('No such interest found!');

    if (interest.receiverId !== userId)
      throw new ForbiddenException('You can not respond to this interest!');

    if (interest.status !== InterestsStatus.PENDING)
      throw new BadRequestException('This interest has already been responded!');

    interest.status = dto.status;
    return this.interestsRepository.save(interest);
  }
}
