import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(email: string, password: string, name: string): Promise<any> {
    const existing = await this.userService.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email is already in use!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.create(email, hashedPassword, name);
    const token = this.jwtService.sign({ id: user.id, email: user.email });
    return { token };
  }

  async signIn(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(password, user.password);
    if(!match) {
        throw new UnauthorizedException('Invalid credentials'); 
    }

    const token = this.jwtService.sign({ id: user.id, email: user.email });
    return { token };
  }
}
