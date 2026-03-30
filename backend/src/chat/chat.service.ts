import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Interests, InterestsStatus } from 'src/interests/entities/interests.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(Interests) private interestRepository: Repository<Interests>
  ) {}

  async verifyAccess(interestId: number, userId: number): Promise<Interests> {
    const interest = await this.interestRepository.findOne({
      where: { id: interestId },
    });

    if (!interest) throw new NotFoundException('Interest not found!');

    if (interest.status !== InterestsStatus.ACCEPTED)
      throw new ForbiddenException('Chat is not unlocked yet!');

    if (interest.senderId !== userId && interest.receiverId !== userId) {
      throw new ForbiddenException('You are not part of this chat');
    }

    return interest;
  }

  async saveMessage(interestId: number, senderId: number, content: string): Promise<Message> {
    const message = this.messageRepository.create({
      interestId,
      senderId,
      content,
    });
    return this.messageRepository.save(message);
  }

  async getMessages(interestId: number, userId: number): Promise<Message[]> {
    await this.verifyAccess(interestId, userId);
    return this.messageRepository.find({
      where: { interestId },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }

  async getMyChats(userId: number) {
    return this.interestRepository.find({
      where: [
        { senderId: userId, status: InterestsStatus.ACCEPTED },
        { receiverId: userId, status: InterestsStatus.ACCEPTED },
      ],
      relations: ['sender', 'receiver'],
      order: { createdAt: 'ASC' },
    });
  }
}
