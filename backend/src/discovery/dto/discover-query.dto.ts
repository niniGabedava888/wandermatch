import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { TravelStyle } from 'src/users/entities/user.entity';

export class DiscoveryQueryDto {
  @IsString()
  city: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsOptional()
  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsEnum(TravelStyle)
  travelStyle: TravelStyle;

  @IsOptional()
  @Type(() => Number)
  age: number;
}
