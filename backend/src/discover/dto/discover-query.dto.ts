import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
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

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 12;
}
