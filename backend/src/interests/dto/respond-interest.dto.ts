import { IsEnum } from 'class-validator';
import { InterestsStatus } from '../entities/interests.entity';

export class RespondInterestDto {
  @IsEnum(InterestsStatus)
  status: InterestsStatus.ACCEPTED | InterestsStatus.REJECTED;
}
