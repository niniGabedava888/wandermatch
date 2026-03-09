import { IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTripDto {
  @ApiProperty({
    example: 'Rome',
    description: 'City the user is traveling to',
  })
  @IsString()
  city: string;

  @ApiProperty({
    example: 'Italy',
    description: 'Country of the trip',
  })
  @IsString()
  country: string;

  @ApiProperty({
    example: '2026-06-01',
    description: 'Trip start date (YYYY-MM-DD)',
    format: 'date',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    example: '2026-06-10',
    description: 'Trip end date (YYYY-MM-DD)',
    format: 'date',
  })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({
    example: 'Backpacking and meeting other solo travelers',
    description: 'Optional trip description',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
