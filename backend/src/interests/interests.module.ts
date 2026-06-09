import { Module } from '@nestjs/common';
import { InterestsController } from './interests.controller';
import { InterestsService } from './interests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interests } from './entities/interests.entity';
import { ChatModule } from 'src/chat/chat.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Interests]), ChatModule, UsersModule],
  controllers: [InterestsController],
  providers: [InterestsService],
  exports: [InterestsService],
})
export class InterestsModule {}
