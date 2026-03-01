import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

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
}
