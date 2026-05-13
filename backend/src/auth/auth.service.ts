import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { randomBytes } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>
  ) {}

  async findCorrectToken(tokenFromCookie: string): Promise<RefreshToken> {
    const [idStr, plainToken] = tokenFromCookie.split('.');
    const tokenId = parseInt(idStr);

    const record = await this.refreshTokenRepository.findOne({
      where: { id: tokenId },
    });

    if (!record) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (record.revoked) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (record.expiresIn < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isValid = await bcrypt.compare(plainToken, record.token);
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');

    return record;
  }

  private async generateTokens(user: User) {
    const accessToken = this.jwtService.sign(
      { id: user.id, email: user.email },
      { expiresIn: 60 * 15 }
    );
    const refreshToken = randomBytes(64).toString('hex');
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);
    const saved = await this.refreshTokenRepository.save({
      token: hashedRefreshToken,
      userId: user.id,
      expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      revoked: false,
    });
    const refreshTokenValue = `${saved.id}.${refreshToken}`;
    return { accessToken, refreshToken: refreshTokenValue };
  }

  async signUp(email: string, password: string, name: string): Promise<any> {
    const existing = await this.userService.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email is already in use!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.create(email, hashedPassword, name);
    return this.generateTokens(user);
  }

  async signIn(email: string, password: string) {
    email = email.trim().toLowerCase();
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async refresh(tokenFromCookie: string) {
    const record = await this.findCorrectToken(tokenFromCookie);

    record.revoked = true;
    await this.refreshTokenRepository.save(record);

    const user = await this.userService.findById(record.userId);

    return this.generateTokens(user);
  }

  async logout(tokenFromCookie: string) {
    const record = await this.findCorrectToken(tokenFromCookie);

    record.revoked = true;
    await this.refreshTokenRepository.save(record);
  }
}
