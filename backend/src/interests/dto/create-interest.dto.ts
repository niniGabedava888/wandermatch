import { IsInt, IsPositive } from 'class-validator';

export class CreateInterestDto {
  @IsInt()
  @IsPositive()
  receiverId: number;
}
