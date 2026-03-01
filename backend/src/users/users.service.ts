import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProfileDto } from './dto/profile/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(email: string, hashedPassword: string, name: string) {
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
    });
    return await this.usersRepository.save(user);
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    return user;
  }

  async findById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: [
        'id',
        'name',
        'age',
        'bio',
        'travelStyle',
        'interests',
        'languages',
        'profilePhoto',
      ],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findMe(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: [
        'id',
        'name',
        'email',
        'age',
        'bio',
        'travelStyle',
        'interests',
        'languages',
        'profilePhoto',
      ],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(id: number, updateProfileDto: UpdateProfileDto) {
    await this.usersRepository.update(id, updateProfileDto);
    return this.findById(id);
  }
}
